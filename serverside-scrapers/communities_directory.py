"""
Women's Health Communities Directory
Generates a comprehensive JSON + HTML directory of women's health communities

INSTALLATION:
pip install requests beautifulsoup4

OUTPUT:
- communities_directory.json (complete community data)
- communities_directory.html (browsable directory)
"""

import json
import requests
import random
from bs4 import BeautifulSoup
from datetime import datetime
import time
import re
import webbrowser
from pathlib import Path  # optional but handy
from fake_useragent import UserAgent as ua

CONFIG_PATH = Path("group_dir.json")
#QUORA_JSON_PATH = Path("quora-topics.json")

class CommunityDirectory:
    def __init__(self):
        self.communities = []
        self.hashtags = []
        self.json_file = 'communities_directory.json'
        self.html_file = 'communities_directory.html'

        # Load external config (all manual groups / hashtags)
        self.config = {}
        try:
            with open(CONFIG_PATH, "r", encoding="utf-8") as f:
                self.config = json.load(f)
            print(f"✅ Loaded group config from {CONFIG_PATH}")

        except FileNotFoundError:
            print(f"⚠️ Config file {CONFIG_PATH} not found. Using empty config.")
            self.config = {}
        except json.JSONDecodeError as e:
            print(f"⚠️ Failed to parse {CONFIG_PATH}: {e}")
            self.config = {}


    def parse_members(self, members):
        """Convert '1.2K', '5,000', '10M' → float, NEVER returns None"""
        if members is None or members == '':
            return 0.0

        if isinstance(members, (int, float)):
            return float(members)

        if not str(members).strip():
            return 0.0

        members_str = str(members).upper().replace(',', '').strip()
        multiplier = 1.0

        if members_str.endswith('K'):
            multiplier = 1000.0
            members_str = members_str[:-1]
        elif members_str.endswith('M'):
            multiplier = 1_000_000.0
            members_str = members_str[:-1]
        elif members_str.endswith('B'):
            multiplier = 1_000_000_000.0
            members_str = members_str[:-1]

        try:
            return float(members_str) * multiplier
        except (ValueError, AttributeError):
            return 0.0  # Always return 0.0 for failures

    def clean_all_data(self):
        """Convert all string numbers to numeric once"""
        # In fetch_all_communities(), clean data PROPERLY:
        for c in self.communities:
            c['number_members_num'] = self.parse_members(c.get('number_members'))  # No default needed

        # Now sorting works perfectly:
        self.communities.sort(key=lambda x: x.get('number_members_num', 0), reverse=True)

    def categorize_content(self, text):
        """Categorize based on health condition"""
        text_lower = text.lower()

        if any(word in text_lower for word in ['pcos', 'polycystic']):
            return 'PCOS'
        elif any(word in text_lower for word in ['endometriosis', 'endo ']):
            return 'Endometriosis'
        elif any(word in text_lower for word in ['pregnancy', 'pregnant']):
            return 'Pregnancy'
        elif any(word in text_lower for word in ['infertility', 'fertility', 'ttc', 'ivf']):
            return 'Infertility & Fertility'
        elif any(word in text_lower for word in ['menopause', 'perimenopause']):
            return 'Menopause'
        elif any(word in text_lower for word in ['breast cancer']):
            return 'Breast Cancer'
        elif any(word in text_lower for word in ['ovarian cancer']):
            return 'Ovarian Cancer'
        elif any(word in text_lower for word in ['cervical cancer']):
            return 'Cervical Cancer'
        elif any(word in text_lower for word in ['thyroid', 'hypothyroid']):
            return 'Thyroid Disorders'
        elif any(word in text_lower for word in ['mental health', 'anxiety', 'depression', 'postpartum']):
            return 'Mental Health'
        elif any(word in text_lower for word in ['fibromyalgia', 'chronic pain']):
            return 'Chronic Pain'
        elif any(word in text_lower for word in ['pmdd', 'pms']):
            return 'PMS & PMDD'
        else:
            return 'General Women\'s Health'

# ========== # ========== # ========== # ========== # ========== # ==========

    def compute_engagement_score(
            self,
            *,
            group_created_at: datetime | None = None,
            base_score: float = 1.0,
            subscribers: int | str = 0,  # Accept str too
            w_activity: float = 0.4,
            w_reach: float = 0.25,
            w_recency: float = 0.15,
            w_quality: float = 0.2,
    ) -> float:

        # Convert subscribers to float, handling K/M suffixes and commas
        def parse_subscribers(subs: int | str) -> float:
            if isinstance(subs, int):
                return float(subs)
            if not subs or subs == '0':
                return 0.0

            subs_str = str(subs).upper().replace(',', '').strip()
            multiplier = 1.0

            if subs_str.endswith('K'):
                multiplier = 1000.0
                subs_str = subs_str[:-1]
            elif subs_str.endswith('M'):
                multiplier = 1_000_000.0
                subs_str = subs_str[:-1]
            elif subs_str.endswith('B'):
                multiplier = 1_000_000_000.0
                subs_str = subs_str[:-1]

            try:
                return float(subs_str) * multiplier
            except ValueError:
                return 0.0  # Fallback for unparseable strings

        subscribers_num = parse_subscribers(subscribers)

        # Rest of your code unchanged
        activity_score = min(subscribers_num / 1_000.0, 100.0)
        reach_score = min(subscribers_num / 2_000.0, 100.0)

        # 3) Recency / age
        if group_created_at is not None:
            age_days = max((datetime.utcnow() - group_created_at).days, 0)
            # Newer gets slightly higher, but older stable communities are not killed
            if age_days < 30:
                recency_score = 90
            elif age_days < 180:
                recency_score = 80
            elif age_days < 365:
                recency_score = 70
            else:
                recency_score = 60
        else:
            recency_score = 75  # neutral default

        # 4) Quality from base_score (0–1 or 0–10)
        if base_score <= 1:
            quality_score = base_score * 100
        else:
            quality_score = min(base_score * 10, 100)

        final_score = (
                w_activity * activity_score +
                w_reach * reach_score +
                w_recency * recency_score +
                w_quality * quality_score
        )

        return round(final_score, 2)

    # ========== FETCH ALL HASHTAGS FROM PLATFORMS ==========
    def fetch_all_hashtags(self):
        """Fetch hashtags from all platforms"""
        print("\n🔖 FETCHING HASHTAGS FROM ALL PLATFORMS")
        print("=" * 70)

        total = 0

        # Reddit hashtags (subreddit topics)
        print("\n🔴 Fetching Reddit trending topics...")
        reddit_hashtags = self.fetch_reddit_hashtags()
        total += reddit_hashtags

        # Instagram hashtags
        print("\n📸 Fetching Instagram hashtags...")
        instagram_hashtags = self.fetch_instagram_hashtags()
        total += instagram_hashtags

        # Twitter hashtags
        print("\n🐦 Fetching Twitter hashtags...")
        twitter_hashtags = self.fetch_twitter_hashtags()
        total += twitter_hashtags

        # Facebook hashtags
        print("\n📘 Fetching Facebook hashtags...")
        facebook_hashtags = self.fetch_facebook_hashtags()
        total += facebook_hashtags

        # Discord topic channels
        print("\n💬 Fetching Discord topic channels...")
        discord_hashtags = self.fetch_discord_hashtags()
        total += discord_hashtags

        # Quora topics
        print("\n🔴 Fetching Quora topic tags...")
        quora_hashtags = self.fetch_quora_hashtags()
        total += quora_hashtags

        print("\n" + "=" * 70)
        print(f"✅ HASHTAG COLLECTION COMPLETE: {total} hashtags")
        print("=" * 70)

        for hashs in self.hashtags:
            hashs['number_members_num'] = self.parse_members(hashs.get('number_members', 0))

        # Now sort works perfectly
        self.hashtags.sort(key=lambda x: x.get('number_members_num', 0) or 0, reverse=True)

        return total

    def fetch_reddit_hashtags(self):
        """Fetch trending topics from Reddit (from config)"""
        hashtags = self.config.get("reddit_hashtags", [])
        count = 0
        for tag in hashtags:
            community = {
                'id': f"reddit_hashtag_{tag['tag'].lower()}",
                'platform': 'Reddit',
                'community_name': f"#{tag['tag']}",
                'source': f"#{tag['tag']}",
                'category': tag['category'],
                'title': f"#{tag['tag']} - Reddit Topic",
                'content': f"Popular Reddit discussions tagged with #{tag['tag']}",
                'url': f"https://www.reddit.com/search/?q=%23{tag['tag']}",
                'number_members': tag['followers'],
                'author': 'Reddit Hashtag',
                'score': tag['followers'],
                'num_comments': 0,
                'created_utc': '',
                'fetched_date': datetime.now().isoformat(),
                'engagement_score': tag['followers']
            }

            #community['engagement_score'] = self.calculate_engagement_score(community)
            self.hashtags.append(community)
            count += 1
            print(f"  ✓ #{tag['tag']}: {tag['followers']:,} followers")

        return count

    def fetch_instagram_hashtags(self):
        """Fetch Instagram hashtags with post counts"""
        hashtags = self.config.get("instagram_hashtags_fetch", [])
        count = 0
        for tag in hashtags:
            community = {
                'id': f"instagram_hashtag_{tag['tag'].lower()}",
                'platform': 'Instagram',
                'community_name': f"#{tag['tag']}",
                'source': f"#{tag['tag']}",
                'category': tag['category'],
                'title': f"#{tag['tag']} - Instagram",
                'content': f"Instagram posts and community using #{tag['tag']}",
                'url': f"https://www.instagram.com/explore/tags/{tag['tag'].lower()}/",
                'number_members': tag['posts'],
                'author': 'Instagram Hashtag',
                'score': tag['posts'],
                'num_comments': 0,
                'created_utc': '',
                'fetched_date': datetime.now().isoformat(),
                'engagement_score': tag['posts']
            }
            self.hashtags.append(community)
            count += 1
            print(f"  ✓ #{tag['tag']}: {tag['posts']:,} posts")

        return count

    def fetch_twitter_hashtags(self):
        """Fetch Twitter hashtags"""
        hashtags = self.config.get("twitter_hashtags_fetch", [])
        count = 0
        for tag in hashtags:
            community = {
                'id': f"twitter_hashtag_{tag['tag'].lower()}",
                'platform': 'Twitter/X',
                'community_name': f"#{tag['tag']}",
                'source': f"#{tag['tag']}",
                'category': tag['category'],
                'title': f"#{tag['tag']} - Twitter",
                'content': f"Twitter conversations and community using #{tag['tag']}",
                'url': f"https://twitter.com/search?q=%23{tag['tag']}",
                'number_members': tag['tweets'],
                'author': 'Twitter Hashtag',
                'score': tag['tweets'],
                'num_comments': 0,
                'created_utc': '',
                'fetched_date': datetime.now().isoformat(),
                'engagement_score': tag['tweets']
            }
            self.hashtags.append(community)
            count += 1
            print(f"  ✓ #{tag['tag']}: {tag['tweets']:,} tweets")

        return count

    def fetch_facebook_hashtags(self):
        """Fetch Facebook hashtags"""
        hashtags = self.config.get("facebook_hashtags_fetch", [])
        count = 0
        for tag in hashtags:
            community = {
                'id': f"facebook_hashtag_{tag['tag'].lower()}",
                'platform': 'Facebook',
                'community_name': f"#{tag['tag']}",
                'source': f"#{tag['tag']}",
                'category': tag['category'],
                'title': f"#{tag['tag']} - Facebook",
                'content': f"Facebook posts and discussions using #{tag['tag']}",
                'url': f"https://www.facebook.com/hashtag/{tag['tag'].lower()}",
                'number_members': tag['posts'],
                'author': 'Facebook Hashtag',
                'score': tag['posts'],
                'num_comments': 0,
                'created_utc': '',
                'fetched_date': datetime.now().isoformat(),
                'engagement_score': tag['posts']
            }
            self.hashtags.append(community)
            count += 1
            print(f"  ✓ #{tag['tag']}: {tag['posts']:,} posts")

        return count

    def fetch_discord_hashtags(self):
        """Fetch Discord topic channels"""
        count = 0
        topics = self.config.get("discord_topics_fetch", [])
        for topic in topics:
            community = {
                'id': f"discord_hashtag_{topic['tag'].lower().replace('-', '_')}",
                'platform': 'Discord',
                'community_name': f"#{topic['tag']}",
                'source': f"#{topic['tag']}",
                'category': topic['category'],
                'title': f"#{topic['tag']} - Discord Channel",
                'content': f"Discord channel for {topic['category']} discussions and support",
                'url': f"https://discord.gg/womenshealth",
                'number_members': topic['members'],
                'author': 'Discord Channel',
                'score': topic['members'],
                'num_comments': 0,
                'created_utc': '',
                'fetched_date': datetime.now().isoformat(),
                'engagement_score': topic['members']
            }
            self.hashtags.append(community)
            count += 1
            print(f"  ✓ #{topic['tag']}: {topic['members']:,} members")

        return count

    def fetch_quora_hashtags(self):
        """Fetch Quora topic tags"""

        count = 0
        topics = self.config.get("quora_hashtags_fetch", [])
        for topic in topics:
            community = {
                'id': f"quora_hashtag_{topic['tag'].lower().replace('-', '_')}",
                'platform': 'Quora',
                'community_name': f"#{topic['tag']}",
                'source': f"#{topic['tag']}",
                'category': topic['category'],
                'title': f"#{topic['tag']} - Quora Topic",
                'content': f"Quora questions and answers tagged with {topic['tag']}",
                'url': f"https://www.quora.com/topic/{topic['tag']}",
                'number_members': topic['followers'],
                'author': 'Quora Topic Tag',
                'score': topic['followers'],
                'num_comments': 0,
                'created_utc': '',
                'fetched_date': datetime.now().isoformat(),
                'engagement_score': topic['followers']
            }
            self.hashtags.append(community)
            count += 1
            print(f"  ✓ #{topic['tag']}: {topic['followers']:,} followers")

        return count

    # ========== # ========== # ========== # ========== # ========== # ==========
    # ========== REDDIT ==========
    def fetch_reddit(self):
        """Fetch Reddit communities"""
        print("\n🔴 Fetching Reddit communities...")


        headers = {'User-Agent': 'CommunityDirectory/1.0'}
        new_count = 0
        subreddits = self.config.get("reddit_subreddits_fetch", [])

        for sub in subreddits:
            try:
                url = f"https://www.reddit.com/r/{sub}/about.json"
                response = requests.get(url, headers=headers, timeout=10)

                if response.status_code != 200:
                    print(f"  ✗ r/{sub}: HTTP {response.status_code}")
                    continue

                data = response.json().get('data', {})

                # Created date as datetime (for engagement) and ISO string (for storage)
                created_ts = data.get('created_utc', 0)  # unix seconds [web:44][web:52]
                created_dt = datetime.utcfromtimestamp(created_ts) if created_ts else None

                subscribers = data.get('subscribers', 0)
                active_users = data.get('active_user_count', 0) or 0  # often null now [web:48][web:47]

                # For now, Reddit about.json does not give comments/views/likes at subreddit level,
                # so we pass 0 and let activity be driven mostly by active_members + age.
                engagement_score = self.compute_engagement_score(
                    group_created_at=created_dt,
                    base_score=1.0,          # or tweak per subreddit
                    subscribers=subscribers,
                )
                community = {
                    'id': f"reddit_{sub.lower()}",
                    'platform': 'Reddit',
                    'community_name': f"r/{sub}",
                    'source': f"r/{sub}",
                    'category': self.categorize_content(
                        data.get('title', '') + ' ' + data.get('public_description', '')
                    ),
                    'title': data.get('title', f"r/{sub}"),
                    'content': data.get('public_description', '')[:500]
                               or 'Community focused on support and discussion',
                    'url': f"https://reddit.com/r/{sub}",
                    'number_members': subscribers,
                    'author': 'Reddit Community',
                    'score': active_users,
                    'num_comments': 0,
                    # store both raw datetime (if your model supports it) and ISO for JSON
                    'created_at': created_dt.isoformat() if created_dt else None,
                    'created_utc': created_dt.isoformat() if created_dt else None,
                    'fetched_date': datetime.utcnow().isoformat(),
                    'engagement_score': engagement_score,
                }

                self.communities.append(community)
                new_count += 1
                print(f"  ✓ r/{sub}: {subscribers:,} members | engagement {engagement_score}")

                time.sleep(1)

            except Exception as e:
                print(f"  ✗ r/{sub}: {str(e)}")

        print(f"✅ Reddit: {new_count} communities")
        return new_count

    # ========== FACEBOOK GROUPS (Manual List) ==========
    def add_facebook_communities(self):
        """Add known Facebook groups (manual list)"""
        print("\n📘 Adding Facebook communities...")

        fb_groups = self.config.get("facebook_groups_manual", [])

        for group in fb_groups:
            # If you have a real created_at from Graph/API, parse to datetime here.
            # For now, assuming not available → None.
            created_dt = None
            subscribers = group.get('members', 0)

            engagement_score = self.compute_engagement_score(
                group_created_at=created_dt,
                base_score=1.0,  # you can tweak per curated group
                subscribers=subscribers,
            )

            url = ""

            if 'search_url' in group:
                url= group['search_url']
            elif 'search_url' in group:
                url = group['url']
            else:
                url = ""

            if('name' in group):
                community = {
                    'id': f"facebook_{group['name'].lower().replace(' ', '_')}",
                    'platform': 'Facebook',
                    'community_name': group['name'],
                    'source': group['name'],
                    'category': group['category'],
                    'title': group['name'],
                    'content': group['description'],
                    'url': url,
                    'number_members': subscribers,
                    'author': 'Facebook Group',
                    'score': subscribers,
                    'num_comments': 0,
                    'created_utc': created_dt.isoformat() if created_dt else None,
                    'fetched_date': datetime.utcnow().isoformat(),
                    'engagement_score': engagement_score,
                }

            else:
                print("FB Group name :", group)
            self.communities.append(community)

        print(f"✅ Facebook: {len(fb_groups)} communities")
        return len(fb_groups)

    # ========== DISCORD SERVERS (Manual List) ==========
    def add_discord_communities(self):
        """Add known Discord servers"""
        print("\n💬 Adding Discord communities...")
        discord_servers = self.config.get("discord_servers_manual", [])

        for server in discord_servers:
            community = {
                'id': f"discord_{server['name'].lower().replace(' ', '_')}",
                'platform': 'Discord',
                'community_name': server['name'],
                'source': server['name'],
                'category': server['category'],
                'title': server['name'],
                'content': server['description'],
                'url': server['invite'],
                'number_members': server['members'],
                'author': 'Discord Server',
                'score': server['members'],
                'num_comments': 0,
                'created_utc': '',
                'fetched_date': datetime.now().isoformat(),
                'engagement_score': server['members']
            }
            self.communities.append(community)

        print(f"✅ Discord: {len(discord_servers)} communities")
        return len(discord_servers)

    # ========== TWITTER/X COMMUNITIES ==========
    def add_twitter_communities(self):
        """Add Twitter/X communities"""
        print("\n🐦 Adding Twitter/X communities...")
        twitter_communities = self.config.get("twitter_communities_manual", [])

        # Parse created date if available from Twitter API (currently empty)
        created_dt = None  # Add: community.get('created_utc') and parse if API provides it later

        for community in twitter_communities:
            comm = {
                'id': f"twitter_{community['name'].lower().replace(' ', '_')}",
                'platform': 'Twitter/X',
                'community_name': community['name'],
                'source': community['name'],
                'category': community['category'],
                'title': community['name'],
                'content': community['description'],
                'url': community['url'],
                'number_members': community['members'],
                'author': 'Twitter Community',
                'score': 0,  # Use computed score
                'num_comments': 0,
                'created_utc': created_dt.isoformat() if created_dt else '',
                'fetched_date': datetime.now().isoformat(),
                'engagement_score': 0  # Consistent computed value
            }

            engagement_score = self.compute_engagement_score(
                group_created_at=created_dt,
                base_score=1.0,
                subscribers=community['members']
            )
            comm['engagement_score'] = engagement_score
            comm['score'] = engagement_score
            #print("Twitter comm ", engagement_score)

            self.communities.append(comm)

        print(f"✅ Twitter/X: {len(twitter_communities)} communities")
        return len(twitter_communities)

    # ========== INSTAGRAM HASHTAGS ==========
    def calculate_instagram_engagement(self, hashtag_data):
        """
        Compute engagement score for Instagram hashtag like #PCOSWarrior.
        Uses provided posts count; requires manual input of aggregated metrics.
        """
        name = hashtag_data["community_name"]
        posts = hashtag_data["posts"]

        print(f"Engagement Calculator for {name} ({posts} posts)")
        print("-" * 50)

        # Input aggregated metrics (from Instagram Insights or tools like Hootsuite)
        total_likes = float(input("Enter total likes across sampled posts: "))
        total_comments = float(input("Enter total comments across sampled posts: "))
        total_shares = float(input("Enter total shares across sampled posts: "))
        total_saves = float(input("Enter total saves across sampled posts: "))
        total_reach = float(input("Enter total reach/impressions across sampled posts: "))
        sample_posts = int(input("Enter number of sampled posts analyzed: "))

        # Core Formula 1: By Reach (industry standard)
        total_engagements = total_likes + total_comments + total_shares + total_saves
        engagement_rate_reach = (total_engagements / total_reach) * 100 if total_reach > 0 else 0

        # Core Formula 2: By Posts
        avg_engagements_per_post = total_engagements / sample_posts
        engagement_rate_posts = (total_engagements / posts) * 100

        # Per Post Average
        avg_engagement_rate = engagement_rate_reach  # Proxy using reach-based

        # Benchmarks
        benchmarks = {
            "Excellent": ">5%",
            "Good": "1-5%",
            "Average": "0.5-1%",
            "Poor": "<0.5%"
        }

        print("\n" + "=" * 50)
        print("ENGAGEMENT RESULTS")
        print("=" * 50)
        print(f"📊 Total Engagements: {total_engagements:,.0f}")
        print(f"📈 Reach/Impressions: {total_reach:,.0f}")
        print(f"📝 Sampled Posts: {sample_posts}")
        print()

        print("METRICS:")
        print(f"  • Engagement Rate (by Reach): {engagement_rate_reach:.2f}%")
        print(f"  • Avg Engagements/Post: {avg_engagements_per_post:.1f}")
        print(f"  • Engagement Rate (by Posts): {engagement_rate_posts:.4f}%")
        print()

        # Performance Assessment
        print("PERFORMANCE:")
        if engagement_rate_reach > 5:
            rating = "Excellent"
        elif engagement_rate_reach > 1:
            rating = "Good"
        elif engagement_rate_reach > 0.5:
            rating = "Average"
        else:
            rating = "Poor"

        print(f"  🎯 Rating: {rating} {benchmarks[rating]}")

        return {
            "hashtag": name,
            "total_posts": posts,
            "total_engagements": total_engagements,
            "total_reach": total_reach,
            "engagement_rate_reach": round(engagement_rate_reach, 2),
            "avg_engagements_per_post": round(avg_engagements_per_post, 1),
            "rating": rating
        }

    def add_instagram_communities(self):
        """Add Instagram hashtag communities"""
        print("\n📸 Adding Instagram communities...")
        instagram_hashtags = self.config.get("instagram_communities_manual", [])

        for hashtag in instagram_hashtags:

            community = {
                'id': f"instagram_{hashtag['name'].replace('#', '').lower()}",
                'platform': 'Instagram',
                'community_name': hashtag['name'],
                'source': hashtag['name'],
                'category': hashtag['category'],
                'title': hashtag['name'],
                'content': hashtag['description'],
                'url': hashtag['url'],
                'number_members': hashtag['posts'],
                'author': 'Instagram Hashtag',
                'score': hashtag['posts'],
                'num_comments': 0,
                'created_utc': '',
                'fetched_date': datetime.now().isoformat(),
                'engagement_score': hashtag['posts']
            }

            created_dt = None
            engagement_score = self.compute_engagement_score(
                group_created_at=created_dt,
                base_score=1.0,
                subscribers=community['number_members']
            )
            community['engagement_score'] = engagement_score
            self.communities.append(community)

        print(f"✅ Instagram: {len(instagram_hashtags)} communities")

        return len(instagram_hashtags)

    # ========== QUORA ==========
    def fetch_quora(self):
        """Fetch Quora topics"""
        print("\n🔴 Fetching Quora topics...")

        topics = self.config.get("quora_topics_manual", [])

        user_agents = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        ]
        #headers = {'User-Agent': random.choice(user_agents), ...}  # Rest of headers
        headers = {
            'User-Agent': random.choice(user_agents),
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'none',
            'Sec-Fetch-User': '?1',
            'Cache-Control': 'max-age=0',
            'Referer': 'https://www.google.com/'  # Mimic search referral
        }

        new_count = 0

        for topic_slug, category in topics:
            try:
                url = f"https://www.quora.com/topic/{topic_slug}"

                response = requests.get(url, headers=headers, timeout=15)

                if response.status_code == 200:
                    soup = BeautifulSoup(response.content, 'html.parser')

                    # Try to extract topic name and follower count
                    title = topic_slug.replace('-', ' ')
                    followers = 10000  # Default estimate

                    # Look for follower count in page
                    followers_text = soup.find(text=re.compile(r'[\d,]+\s+follower', re.I))
                    if followers_text:
                        match = re.search(r'([\d,]+)', str(followers_text))
                        if match:
                            followers = int(match.group(1).replace(',', ''))

                    created_dt = None
                    community = {
                        'id': f"quora_{topic_slug.lower()}",
                        'platform': 'Quora',
                        'community_name': title,
                        'source': title,
                        'category': category,
                        'title': f"{title} - Quora Topic",
                        'content': f"Quora topic for questions and discussions about {title.lower()}",
                        'url': url,
                        'number_members': followers,
                        'author': 'Quora Community',
                        'score': followers,
                        'num_comments': 0,
                        'created_utc': '',
                        'fetched_date': datetime.now().isoformat(),
                        'engagement_score': followers
                    }

                    engagement_score = self.compute_engagement_score(
                        group_created_at=created_dt,
                        base_score=1.0,
                        subscribers=community['number_members']
                    )
                    community['engagement_score'] = engagement_score
                    community['score'] = engagement_score

                    self.communities.append(community)
                    new_count += 1
                    print(f"✓ {title}: {followers:,} followers")
                    time.sleep(2)

            except Exception as e:
                print(f"  ✗ {topic_slug}: {str(e)}")

        print("Now Revisiting Manually Scarapped Quora topics")
        quora_m_topics = self.config.get("quora_topics_manual_search", [])
        for item in quora_m_topics:
            # Map raw fields to your variables
            title = item.get('community_name', '')
            category = item.get('category', '')
            url = item.get('url', '')
            followers = item.get('number_members', '0')
            created_dt = item.get('created_at', '')

            # Derive topic_slug from URL (e.g., "Womens-Health" from "https://www.quora.com/topic/Womens-Health")
            topic_slug = url.split('/')[-1] if url else 'unknown'

            # Populate the community dictionary template
            community = {
                'id': f"quora_{topic_slug.lower()}",
                'platform': 'Quora',
                'community_name': title,
                'source': title,
                'category': category,
                'title': f"{title} - Quora Topic",
                'content': f"Quora topic for questions and discussions about {title.lower()}",
                'url': url,
                'number_members': followers,
                'author': 'Quora Community',
                'score': followers,
                'num_comments': 0,
                'created_utc': created_dt,
                'fetched_date': datetime.now().isoformat(),
                'engagement_score': followers
            }

            group_created_at = datetime.strptime(created_dt.replace('Z', ''), "%Y-%m-%dT%H:%M:%S")

            engagement_score = self.compute_engagement_score(
                group_created_at=group_created_at,
                base_score=1.0,
                subscribers=community['number_members']
            )
            community['engagement_score'] = engagement_score
            community['score'] = engagement_score

            self.communities.append(community)
            new_count += 1
            print(f"  ✓ {title}: {followers}: followers")
            time.sleep(2)

        print(f"✅ Quora: {new_count} topics")
        return new_count

    def clean_communities_data(self):
        """Convert all string numbers to floats once"""
        for community in self.communities:
            community['number_members_clean'] = self.parse_members(community.get('number_members', 0))
            # Also clean other numeric fields if needed:
            # community['engagement_score_clean'] = parse_members(community.get('engagement_score', 0))


    def fetch_all_communities(self):
        """Fetch all communities"""
        print("\n" + "="*70)
        print("🚀 WOMEN'S HEALTH COMMUNITIES DIRECTORY")
        print("="*70)

        start_time = time.time()

        total = 0
        total += self.fetch_reddit()
        total += self.add_facebook_communities()
        total += self.add_discord_communities()
        total += self.add_twitter_communities()
        total += self.add_instagram_communities()
        total += self.fetch_quora()

        # Before sorting: # Clean data after fetching
        for comm in self.communities:
            comm['number_members_num'] = self.parse_members(comm.get('number_members', 0))

        # Now sort works perfectly
        self.communities.sort(key=lambda x: x.get('number_members_num', 0) or 0, reverse=True)

        print("Top 5 communities by size:")
        for comm in self.communities[:5]:
            print(f"{comm}")
        # Sort by member count
        #self.communities.sort(key=lambda x: x.get('number_members', 0), reverse=True)

        elapsed = time.time() - start_time

        print("\n" + "="*70)
        print(f"✅ COLLECTION COMPLETE!")
        print(f"📊 Total Communities: {len(self.communities)}")
        print(f"📊 Total Hashtags: {len(self.hashtags)}")
        print(f"⏱️  Time: {elapsed:.1f} seconds")
        print("="*70)

    def clean_member_count(self, count_str):
        if isinstance(count_str, int):
            return count_str

        count_str = str(count_str).upper().replace(',', '').replace('+', '').strip()

        if 'K' in count_str:
            return int(float(count_str.replace('K', '')) * 1_000)
        if 'M' in count_str:
            return int(float(count_str.replace('M', '')) * 1_000_000)

        try:
            return int(count_str)
        except ValueError:
            return 0

    def save_json(self):
        """Save to JSON"""
        print("***Total Hashtags ",  len(self.hashtags))
        data = {
            'metadata': {
                'generated_at': datetime.now().isoformat(),
                'total_communities': len(self.communities),
                'total_hashtags': len(self.hashtags),
                'platforms': list(set(c['platform'] for c in self.communities)),
                'categories': list(set(c['category'] for c in self.communities)),
                'total_members': sum(self.parse_members(c.get('number_members', 0)) for c in self.communities)
            },

            'communities': self.communities,
            'hashtags': self.hashtags
        }

        with open(self.json_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)

        print(f"\n💾 JSON saved: {self.json_file}")

    def generate_html(self):
        """Generate HTML directory"""
        print("\n📄 Generating HTML directory...")

        # Group by category
        by_category = {}
        for comm in self.communities:
            cat = comm['category']
            if cat not in by_category:
                by_category[cat] = []
            by_category[cat].append(comm)

            # Calculate the numeric value once
            comm['numeric_members'] = self.clean_member_count(comm['number_members'])

        # Stats
        total_members = sum(self.parse_members(c.get('number_members', 0)) for c in self.communities) + sum(self.parse_members(c.get('number_members', 0)) for c in self.hashtags)
        platforms = set(c['platform'] for c in self.communities)

        html = f"""<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Women's Health Communities Directory</title>
            <style>
                * {{
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }}

                body {{
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    min-height: 100vh;
                    padding: 20px;
                }}

                .container {{
                    max-width: 1400px;
                    margin: 0 auto;
                }}

                .header {{
                    background: white;
                    padding: 30px;
                    border-radius: 15px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                    margin-bottom: 30px;
                }}

                .header h1 {{
                    color: #667eea;
                    margin-bottom: 10px;
                    font-size: 2em;
                }}

                .header p {{
                    color: #666;
                    font-size: 0.9em;
                }}

                .stats {{
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 20px;
                    margin-bottom: 30px;
                }}

                .stat-box {{
                    background: white;
                    padding: 25px;
                    border-radius: 12px;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                    transition: transform 0.3s ease;
                }}

                .stat-box:hover {{
                    transform: translateY(-5px);
                }}

                .stat-box h3 {{
                    color: #667eea;
                    font-size: 2em;
                    margin-bottom: 5px;
                }}

                .stat-box p {{
                    color: #666;
                    font-size: 0.9em;
                }}

                .filters {{
                    background: white;
                    padding: 25px;
                    border-radius: 12px;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                    margin-bottom: 30px;
                }}

                .filters h2 {{
                    margin-bottom: 20px;
                    color: #667eea;
                }}

                .filter-group {{
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 20px;
                    margin-bottom: 20px;
                }}

                .filter-item {{
                    display: flex;
                    flex-direction: column;
                }}

                label {{
                    color: #333;
                    font-weight: 600;
                    margin-bottom: 8px;
                    font-size: 0.9em;
                }}

                select, input {{
                    padding: 10px;
                    border: 2px solid #e0e0e0;
                    border-radius: 8px;
                    font-size: 0.95em;
                    transition: border-color 0.3s ease;
                }}

                select:focus, input:focus {{
                    outline: none;
                    border-color: #667eea;
                }}

                .sort-buttons {{
                    display: flex;
                    gap: 10px;
                    flex-wrap: wrap;
                }}

                .sort-btn {{
                    padding: 10px 20px;
                    border: 2px solid #667eea;
                    background: white;
                    color: #667eea;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: all 0.3s ease;
                }}

                .sort-btn:hover {{
                    background: #667eea;
                    color: white;
                }}

                .sort-btn.active {{
                    background: #667eea;
                    color: white;
                }}

                .reset-btn {{
                    background: #764ba2;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: background 0.3s ease;
                }}

                .reset-btn:hover {{
                    background: #5e3a82;
                }}

                .search-bar {{
                    margin-bottom: 20px;
                }}

                .search-input {{
                    width: 100%;
                    padding: 10px;
                    border: 2px solid #e0e0e0;
                    border-radius: 8px;
                    font-size: 0.95em;
                    transition: border-color 0.3s ease;
                }}

                .search-input:focus {{
                    outline: none;
                    border-color: #667eea;
                }}

                .category-section {{
                    margin-bottom: 30px;
                }}

                .category-header {{
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                    padding-bottom: 15px;
                    border-bottom: 2px solid #f0f0f0;
                }}

                .category-title {{
                    font-size: 1.5em;
                    font-weight: 700;
                    color: #667eea;
                }}

                .category-count {{
                    background: #f0f0f0;
                    padding: 5px 15px;
                    border-radius: 20px;
                    font-size: 0.9em;
                    color: #666;
                }}

                .communities-grid {{
                    display: grid;
                    gap: 20px;
                }}

                .community-card {{
                    background: white;
                    padding: 25px;
                    border-radius: 12px;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }}

                .community-card:hover {{
                    transform: translateY(-3px);
                    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
                }}

                .community-name {{
                    color: #333;
                    font-size: 1.3em;
                    font-weight: 700;
                    margin-bottom: 10px;
                }}

                .community-platform {{
                    display: inline-block;
                    padding: 5px 12px;
                    border-radius: 20px;
                    font-size: 0.85em;
                    font-weight: 600;
                    margin-bottom: 15px;
                }}

                .platform-reddit {{ background: #ff4500; color: white; }}
                .platform-facebook {{ background: #1877f2; color: white; }}
                .platform-discord {{ background: #5865f2; color: white; }}
                .platform-twitter-x {{ background: #1da1f2; color: white; }}
                .platform-instagram {{ background: #e4405f; color: white; }}
                .platform-quora {{ background: #b92b27; color: white; }}

                .community-description {{
                    color: #555;
                    line-height: 1.6;
                    margin-bottom: 15px;
                }}

                .community-stats {{
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-top: 15px;
                    border-top: 2px solid #f0f0f0;
                    color: #666;
                    font-size: 0.9em;
                }}

                .members {{
                    font-weight: 600;
                    color: #667eea;
                }}

                .join-btn {{
                    color: #667eea;
                    text-decoration: none;
                    font-weight: 600;
                    display: inline-block;
                    transition: color 0.3s ease;
                }}

                .join-btn:hover {{
                    text-decoration: underline;
                }}

                .no-results {{
                    background: white;
                    padding: 40px;
                    border-radius: 12px;
                    text-align: center;
                    color: #666;
                }}

                @media (max-width: 768px) {{
                    .communities-grid {{
                        grid-template-columns: 1fr;
                    }}

                    .stats {{
                        grid-template-columns: 1fr 1fr;
                    }}
                }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>💜 Women's Health Communities Directory</h1>
                    <p>Connect with supportive communities across all platforms</p>
                    <p>Last Updated: {datetime.now().strftime("%B %d, %Y at %I:%M %p")}</p>
                </div>

                <div class="stats">
                    <div class="stat-box">
                        <h3>{len(self.communities)}</h3>
                        <p>Total Communities</p>
                    </div>
                    <div class="stat-box">
                        <h3>{len(platforms)}</h3>
                        <p>Platforms</p>
                    </div>
                    <div class="stat-box">
                        <h3>{len(by_category)}</h3>
                        <p>Health Categories</p>
                    </div>
                    
                     <div class="stat-box">
                        <h3>{len(self.hashtags)}</h3>
                        <p>Total Hashtags</p>
                    </div>
                    
                    <div class="stat-box">
                        <h3>{total_members:,}</h3>
                        <p>Total Members</p>
                    </div>
                </div>

                <div class="filters">
                    <h2>Filters & Sorting</h2>

                    <div class="filter-group">
                        <div class="filter-item">
                            <label for="platformFilter">Platform</label>
                            <select id="platformFilter">
                                <option value="all">All Platforms</option>
                                <option value="Reddit">Reddit</option>
                                <option value="Facebook">Facebook</option>
                                <option value="Discord">Discord</option>
                                <option value="Twitter/X">Twitter/X</option>
                                <option value="Instagram">Instagram</option>
                                <option value="Quora">Quora</option>
                            </select>
                        </div>

                        <div class="filter-item">
                            <label for="categoryFilter">Health Category</label>
                            <select id="categoryFilter">
                                <option value="all">All Categories</option>"""

        # Add all unique categories
        for category in sorted(set(c['category'] for c in self.communities)):
            html += f"""
                                <option value="{category}">{category}</option>"""

        html += """
                            </select>
                        </div>

                        <div class="filter-item">
                            <label for="searchFilter">Search Communities</label>
                            <input type="text" id="searchFilter" placeholder="Search by name or description...">
                        </div>

                        <div class="filter-item">
                            <label for="hashtagFilter">Hashtags</label>
                            <input type="text" id="hashtagFilter" placeholder="#pcos, reddit, instagram">
                        </div>
                    </div>

                    <div class="filter-item" style="margin-bottom: 15px;">
                        <label>Sort By</label>
                        <div class="sort-buttons">
                            <button class="sort-btn active" data-sort="members-desc">Highest Members</button>
                            <button class="sort-btn" data-sort="members-asc">Lowest Members</button>
                            <button class="sort-btn" data-sort="engagement-desc">Highest Engagement</button>
                            <button class="sort-btn" data-sort="engagement-asc">Lowest Engagement</button>
                        </div>
                    </div>

                    <button class="reset-btn" onclick="resetFilters()">Reset All Filters</button>
                </div>

                <div id="communitiesContainer">"""

        # Generate communities by category
        for category, comms in sorted(by_category.items(),
                                      key=lambda x: sum(self.parse_members(c.get('number_members', 0)) for c in x[1]),
                                      reverse=True):
            #total_cat_members = sum(c['number_members'] for c in comms)
            total_cat_members = sum(self.parse_members(c.get('number_members', 0)) for c in comms)

            html += f"""
                        <div class="category-section" data-category="{category}">
                            <div class="category-header">
                                <div class="category-title">{category}</div>
                                <div class="category-count">{len(comms)} communities • {total_cat_members:,} members</div>
                            </div>
                            <div class="communities-grid">"""

            for comm in comms:
                platform_class = comm['platform'].lower().replace('/', '-').replace(' ', '-')
                # hashtags: list like ['pcos', 'fertility']; source: e.g. 'reddit', 'instagram'
                hashtags_attr = ",".join((comm.get('hashtags') or []))
                source_attr = (comm.get('source') or comm['platform']).lower()
                html += f"""
                                <div class="community-card" 
                                     data-platform="{comm['platform']}" 
                                     data-category="{category}"
                                     data-name="{comm['community_name'].lower()}"
                                     data-members="{comm['number_members']}"
                                     data-engagement="{comm['engagement_score']}"
                                     data-hashtags="{hashtags_attr}"
                                     data-source="{source_attr}">
                                    <div class="community-name">{comm['community_name']}</div>
                                    <span class="community-platform platform-{platform_class}">{comm['platform']}</span>
                                    <div class="community-description">{comm['content']}</div>
                                    <div class="community-stats">
                                        <span class="members"> {comm['numeric_members']} members</span>
                                        <a href="{comm['url']}" target="_blank" class="join-btn">View Community →</a>
                                    </div>
                                </div>"""

            html += """
            
                            </div>
                        </div>"""

        html += """
                    </div>
                </div>
            </div>

            <script>
                // Global variables
                let currentSort = 'members-desc';
                let allCards = [];

                document.addEventListener('DOMContentLoaded', function() {
                    allCards = Array.from(document.querySelectorAll('.community-card'));
                    applyFilters();
                });

                function applyFilters() {
                    const platform = document.getElementById('platformFilter').value;
                    const category = document.getElementById('categoryFilter').value;
                    const search = document.getElementById('searchFilter').value.toLowerCase();
                    const hashtagInput = document.getElementById('hashtagFilter').value.toLowerCase();

                    let selectedTags = [];
                    if (hashtagInput.trim() !== '') {
                        selectedTags = hashtagInput
                            .split(',')
                            .map(h => h.trim().replace(/^#/, ''))
                            .filter(h => h.length > 0);
                    }

                    const cards = document.querySelectorAll('.community-card');
                    const sections = document.querySelectorAll('.category-section');

                    cards.forEach(card => {
                        const cardPlatform = (card.dataset.platform || '').toLowerCase();
                        const cardCategory = card.dataset.category;
                        const cardText = card.textContent.toLowerCase();
                        const cardHashtags = (card.dataset.hashtags || '')
                            .toLowerCase()
                            .split(',')
                            .map(h => h.trim())
                            .filter(h => h.length > 0);
                        const cardSource = (card.dataset.source || '').toLowerCase();

                        const matchesPlatform = platform === 'all' || cardPlatform === platform.toLowerCase();
                        const matchesCategory = category === 'all' || cardCategory === category;
                        const matchesSearch = search === '' || cardText.includes(search);

                        // Tag filter: any selected tag can match hashtag list OR source.
                        let matchesTags = true;
                        if (selectedTags.length > 0) {
                            const tagSet = new Set(cardHashtags);
                            matchesTags = selectedTags.some(t => tagSet.has(t) || t === cardSource);
                        }

                        if (matchesPlatform && matchesCategory && matchesSearch && matchesTags) {
                            card.style.display = 'block';
                        } else {
                            card.style.display = 'none';
                        }
                    });

                    sections.forEach(section => {
                        const visibleCards = Array.from(
                            section.querySelectorAll('.community-card')
                        ).filter(c => c.style.display !== 'none');
                        section.style.display = visibleCards.length > 0 ? 'block' : 'none';
                    });

                    sortCommunities();
                }

                function sortCommunities() {
                    const [field, direction] = currentSort.split('-');
                    const sections = document.querySelectorAll('.category-section');

                    sections.forEach(section => {
                        const grid = section.querySelector('.communities-grid');
                        const cards = Array.from(grid.querySelectorAll('.community-card'));

                        cards.sort((a, b) => {
                            let aVal, bVal;

                            if (field === 'members') {
                                aVal = parseInt(a.dataset.members) || 0;
                                bVal = parseInt(b.dataset.members) || 0;
                            } else {
                                aVal = parseInt(a.dataset.engagement) || 0;
                                bVal = parseInt(b.dataset.engagement) || 0;
                            }

                            return direction === 'desc' ? bVal - aVal : aVal - bVal;
                        });

                        cards.forEach(card => grid.appendChild(card));
                    });
                }

                function resetFilters() {
                    document.getElementById('platformFilter').value = 'all';
                    document.getElementById('categoryFilter').value = 'all';
                    document.getElementById('searchFilter').value = '';
                    document.getElementById('hashtagFilter').value = '';
                    currentSort = 'members-desc';

                    document.querySelectorAll('.sort-btn').forEach(btn => {
                        btn.classList.toggle('active', btn.dataset.sort === 'members-desc');
                    });

                    applyFilters();
                }

                // Event listeners
                document.getElementById('platformFilter').addEventListener('change', applyFilters);
                document.getElementById('categoryFilter').addEventListener('change', applyFilters);
                document.getElementById('searchFilter').addEventListener('input', applyFilters);
                document.getElementById('hashtagFilter').addEventListener('input', applyFilters);

                document.querySelectorAll('.sort-btn').forEach(btn => {
                    btn.addEventListener('click', function() {
                        document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
                        this.classList.add('active');
                        currentSort = this.dataset.sort;
                        sortCommunities();
                    });
                });
            </script>
        </body>
        </html>"""

        with open(self.html_file, 'w', encoding='utf-8') as f:
            f.write(html)

        print(f"✅ HTML saved: {self.html_file}")

def main():
    print("""
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║       WOMEN'S HEALTH COMMUNITIES DIRECTORY GENERATOR         ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝

📱 PLATFORMS INCLUDED:
   ✅ Reddit (live API data)
   ✅ Facebook Groups (curated list)
   ✅ Discord Servers (known communities)
   ✅ Twitter/X (hashtag communities)
   ✅ Instagram (hashtag communities)
   ✅ Quora (live API data)

📊 OUTPUT FILES:
   • communities_directory.json (complete data)
   • communities_directory.html (browsable directory)

🏥 HEALTH CATEGORIES COVERED:
   • PCOS
   • Endometriosis
   • Pregnancy & Fertility
   • Menopause
   • Breast Cancer
   • Thyroid Disorders
   • Mental Health
   • Chronic Pain
   • And more!

⚡ INSTALLATION:
   pip install requests beautifulsoup4
    """)

    input("\nPress Enter to generate directory...")

    try:
        directory = CommunityDirectory()
        directory.fetch_all_communities()
        directory.fetch_all_hashtags()
        directory.save_json()
        directory.generate_html()

        print("\n" + "="*70)
        print("✅ DIRECTORY GENERATED SUCCESSFULLY!")
        print(f"📄 JSON: {directory.json_file}")
        print(f"🌐 HTML: {directory.html_file}")
        print("="*70)

        # Open HTML in browser
        #webbrowser.open(directory.html_file)
        print("\n🌐 Opening directory in browser...")

    except KeyboardInterrupt:
        print("\n\n⚠️  Interrupted by user")
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    main()