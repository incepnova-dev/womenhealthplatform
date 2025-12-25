"""
Comprehensive Women's Health Discussion Aggregator
Pulls from: Reddit, Mastodon, RSS, HealthUnlocked, Patient.info, Inspire.com, Stack Exchange

ONE-SHOT EXECUTION: Run once, get complete dashboard ranked by engagement

INSTALLATION:
pip install requests beautifulsoup4 feedparser lxml
"""

import json
import requests
from bs4 import BeautifulSoup
import feedparser
from datetime import datetime, timedelta
import time
import webbrowser
from collections import defaultdict
import re
from urllib.parse import quote, urljoin


class ComprehensiveHealthAggregator:
    def __init__(self):
        self.discussions = []
        self.filename = 'complete_health_data.json'

        # Comprehensive women's health conditions
        self.health_conditions = [
            'PCOS', 'Polycystic Ovary Syndrome',
            'Endometriosis',
            'Uterine Fibroids', 'Leiomyomas',
            'Breast Cancer',
            'Cervical Cancer',
            'Ovarian Cancer',
            'Menopause', 'Perimenopause',
            'Vaginal Yeast Infection', 'Candidiasis',
            'UTI', 'Urinary Tract Infection',
            'Ovarian Cysts',
            'Pelvic Inflammatory Disease', 'PID',
            'Infertility', 'Fertility', 'Conceiving', 'TTC',
            'PMS', 'PMDD', 'Premenstrual Syndrome',
            'Gestational Diabetes',
            'Postpartum Depression', 'PPD',
            'Thyroid', 'Hypothyroidism', 'Hyperthyroidism',
            'Osteoporosis',
            'Preeclampsia',
            'Vaginismus',
            'Bacterial Vaginosis', 'BV',
            'Autoimmune', 'Lupus', 'Rheumatoid Arthritis',
            'Pregnancy', 'Pregnant', 'Expecting',
            'Women Mental Health', 'Anxiety', 'Depression',
            'Fibromyalgia', 'Chronic Fatigue'
        ]

    def calculate_engagement_score(self, disc):
        """Calculate engagement score for ranking"""
        score = 0

        # Base scores from different metrics
        if 'score' in disc:
            score += disc['score'] * 2
        if 'num_comments' in disc:
            score += disc['num_comments'] * 5
        if 'replies_count' in disc:
            score += disc['replies_count'] * 5
        if 'views' in disc:
            score += disc['views'] * 0.1
        if 'likes' in disc:
            score += disc['likes'] * 2

        # Recency bonus
        try:
            date_str = disc.get('created_utc', disc.get('published_at', disc.get('fetched_date', '')))
            if date_str:
                post_date = datetime.fromisoformat(date_str.replace('Z', '+00:00'))
                days_old = (datetime.now() - post_date.replace(tzinfo=None)).days
                if days_old < 7:
                    score *= 2
                elif days_old < 30:
                    score *= 1.5
        except:
            pass

        return int(score)

    def categorize_content(self, text):
        """Categorize based on comprehensive condition list"""
        text_lower = text.lower()

        # Priority matching (most specific first)
        if any(word in text_lower for word in ['pcos', 'polycystic']):
            return 'PCOS'
        elif any(word in text_lower for word in ['endometriosis', 'endo ']):
            return 'Endometriosis'
        elif any(word in text_lower for word in ['fibroid', 'leiomyoma']):
            return 'Uterine Fibroids'
        elif any(word in text_lower for word in ['breast cancer']):
            return 'Breast Cancer'
        elif any(word in text_lower for word in ['cervical cancer', 'hpv vaccine']):
            return 'Cervical Cancer'
        elif any(word in text_lower for word in ['ovarian cancer']):
            return 'Ovarian Cancer'
        elif any(word in text_lower for word in ['menopause', 'perimenopause', 'hot flash']):
            return 'Menopause'
        elif any(word in text_lower for word in ['yeast infection', 'candida', 'thrush']):
            return 'Yeast Infection'
        elif any(word in text_lower for word in ['uti', 'urinary tract', 'bladder infection']):
            return 'UTI'
        elif any(word in text_lower for word in ['ovarian cyst']):
            return 'Ovarian Cysts'
        elif any(word in text_lower for word in ['pid', 'pelvic inflammatory']):
            return 'Pelvic Inflammatory Disease'
        elif any(word in text_lower for word in ['infertility', 'infertile', 'ttc', 'trying to conceive', 'ivf', 'fertility']):
            return 'Infertility & Fertility'
        elif any(word in text_lower for word in ['pms', 'pmdd', 'premenstrual']):
            return 'PMS & PMDD'
        elif any(word in text_lower for word in ['gestational diabetes']):
            return 'Gestational Diabetes'
        elif any(word in text_lower for word in ['postpartum depression', 'ppd', 'postnatal depression']):
            return 'Postpartum Depression'
        elif any(word in text_lower for word in ['thyroid', 'hypothyroid', 'hyperthyroid', 'hashimoto']):
            return 'Thyroid Disorders'
        elif any(word in text_lower for word in ['osteoporosis', 'bone density']):
            return 'Osteoporosis'
        elif any(word in text_lower for word in ['preeclampsia', 'pre-eclampsia']):
            return 'Preeclampsia'
        elif any(word in text_lower for word in ['vaginismus']):
            return 'Vaginismus'
        elif any(word in text_lower for word in ['bacterial vaginosis', 'bv ']):
            return 'Bacterial Vaginosis'
        elif any(word in text_lower for word in ['lupus', 'autoimmune', 'rheumatoid']):
            return 'Autoimmune Diseases'
        elif any(word in text_lower for word in ['pregnancy', 'pregnant', 'expecting', 'prenatal']):
            return 'Pregnancy'
        elif any(word in text_lower for word in ['anxiety', 'depression', 'mental health', 'therapy']):
            return 'Mental Health'
        elif any(word in text_lower for word in ['fibromyalgia']):
            return 'Fibromyalgia'
        else:
            return 'General Women\'s Health'

    # ========== REDDIT ==========
    def fetch_reddit(self):
        """Fetch from Reddit"""
        print("\n🔴 Fetching from Reddit...")

        subreddits = [
            'PCOS', 'Endo', 'endometriosis', 'TryingForABaby', 'infertility',
            'Menopause', 'pregnant', 'BabyBumps', 'PregnancyAfterLoss',
            'breastcancer', 'cancer', 'ovariancancer',
            'thyroidhealth', 'Hypothyroidism', 'Hashimotos',
            'ttcafterloss', 'IVF', 'stilltrying',
            'WomensHealth', 'TwoXChromosomes', 'AskWomen',
            'Fibromyalgia', 'ChronicPain',
            'Anxiety', 'depression', 'mentalhealth',
            'PMDD', 'PMS',
        ]

        headers = {'User-Agent': 'ComprehensiveHealthAggregator/2.0'}
        new_count = 0

        for subreddit in subreddits:
            try:
                url = f"https://www.reddit.com/r/{subreddit}/hot.json?limit=50"
                response = requests.get(url, headers=headers, timeout=10)

                if response.status_code == 200:
                    data = response.json()
                    posts = data['data']['children']

                    for post in posts:
                        p = post['data']
                        disc_id = f"reddit_{p['id']}"

                        if any(d['id'] == disc_id for d in self.discussions):
                            continue

                        full_text = f"{p['title']} {p.get('selftext', '')}"
                        category = self.categorize_content(full_text)

                        discussion = {
                            'id': disc_id,
                            'platform': 'Reddit',
                            'source': f"r/{subreddit}",
                            'category': category,
                            'title': p['title'],
                            'content': p.get('selftext', '')[:800],
                            'url': f"https://reddit.com{p['permalink']}",
                            'author': p['author'],
                            'score': p['score'],
                            'num_comments': p['num_comments'],
                            'created_utc': datetime.fromtimestamp(p['created_utc']).isoformat(),
                            'fetched_date': datetime.now().isoformat()
                        }

                        discussion['engagement_score'] = self.calculate_engagement_score(discussion)
                        self.discussions.append(discussion)
                        new_count += 1

                    print(f"  ✓ r/{subreddit}: {len(posts)} posts")
                    time.sleep(1.5)

            except Exception as e:
                print(f"  ✗ r/{subreddit}: {str(e)}")

        print(f"✅ Reddit: {new_count} discussions")
        return new_count

    # ========== MASTODON ==========
    def fetch_mastodon(self):
        """Fetch from Mastodon"""
        print("\n🐘 Fetching from Mastodon...")

        instances = ['mastodon.social', 'med-mastodon.com']
        hashtags = [
            'PCOS', 'Endometriosis', 'Menopause', 'BreastCancer',
            'WomensHealth', 'Pregnancy', 'Infertility', 'MentalHealth',
            'ChronicIllness', 'Fibromyalgia', 'Thyroid'
        ]

        new_count = 0

        for instance in instances:
            for hashtag in hashtags:
                try:
                    url = f"https://{instance}/api/v1/timelines/tag/{hashtag}"
                    response = requests.get(url, params={'limit': 20}, timeout=10)

                    if response.status_code == 200:
                        toots = response.json()

                        for toot in toots:
                            disc_id = f"mastodon_{toot['id']}"

                            if any(d['id'] == disc_id for d in self.discussions):
                                continue

                            content = re.sub('<[^<]+?>', '', toot['content'])
                            category = self.categorize_content(content)

                            discussion = {
                                'id': disc_id,
                                'platform': 'Mastodon',
                                'source': f"{instance}",
                                'category': category,
                                'title': content[:150] + '...' if len(content) > 150 else content,
                                'content': content[:800],
                                'url': toot['url'],
                                'author': toot['account']['display_name'] or toot['account']['username'],
                                'score': toot['favourites_count'] + toot['reblogs_count'],
                                'num_comments': toot['replies_count'],
                                'created_utc': toot['created_at'],
                                'fetched_date': datetime.now().isoformat()
                            }

                            discussion['engagement_score'] = self.calculate_engagement_score(discussion)
                            self.discussions.append(discussion)
                            new_count += 1

                        print(f"  ✓ {instance} #{hashtag}: {len(toots)} toots")
                        time.sleep(1)

                except Exception as e:
                    print(f"  ✗ {instance} #{hashtag}: {str(e)}")

        print(f"✅ Mastodon: {new_count} discussions")
        return new_count

    # ========== HEALTHUNLOCKED ==========
    def fetch_healthunlocked(self):
        """Fetch from HealthUnlocked"""
        print("\n💚 Fetching from HealthUnlocked...")

        communities = [
            'pcosfriendly', 'endometriosis-uk', 'thyroiduk',
            'fibromyalgia-support', 'breast-cancer-care',
            'menopause-matters', 'fertility-network-uk'
        ]

        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        new_count = 0

        for community in communities:
            try:
                url = f"https://healthunlocked.com/{community}"
                response = requests.get(url, headers=headers, timeout=15)

                if response.status_code == 200:
                    soup = BeautifulSoup(response.content, 'html.parser')

                    # Find post elements (structure may vary)
                    posts = soup.find_all('article', limit=20)

                    for post in posts:
                        try:
                            title_elem = post.find(['h2', 'h3', 'a'])
                            if not title_elem:
                                continue

                            title = title_elem.get_text(strip=True)
                            link = title_elem.get('href', '')
                            if link and not link.startswith('http'):
                                link = urljoin(url, link)

                            disc_id = f"healthunlocked_{hash(link)}"

                            if any(d['id'] == disc_id for d in self.discussions):
                                continue

                            content_elem = post.find(['p', 'div'], class_=re.compile('content|text|body', re.I))
                            content = content_elem.get_text(strip=True)[:800] if content_elem else ""

                            category = self.categorize_content(f"{title} {content}")

                            # Extract engagement metrics
                            likes = replies = 0
                            stats = post.find_all(text=re.compile(r'\d+'))
                            if stats:
                                try:
                                    likes = int(re.search(r'\d+', str(stats[0])).group())
                                    if len(stats) > 1:
                                        replies = int(re.search(r'\d+', str(stats[1])).group())
                                except:
                                    pass

                            discussion = {
                                'id': disc_id,
                                'platform': 'HealthUnlocked',
                                'source': community,
                                'category': category,
                                'title': title,
                                'content': content,
                                'url': link or url,
                                'author': 'Community Member',
                                'likes': likes,
                                'num_comments': replies,
                                'fetched_date': datetime.now().isoformat()
                            }

                            discussion['engagement_score'] = self.calculate_engagement_score(discussion)
                            self.discussions.append(discussion)
                            new_count += 1

                        except Exception as e:
                            continue

                    print(f"  ✓ {community}: {len(posts)} posts")
                    time.sleep(2)

            except Exception as e:
                print(f"  ✗ {community}: {str(e)}")

        print(f"✅ HealthUnlocked: {new_count} discussions")
        return new_count

    def fetch_patient_info(self):
        """Fetch from Patient.info community"""
        print("\n🏥 Fetching from Patient.info...")

        forums = [
            "tag/womens%20health",  # Women's health category
            "tag/polycystic%20ovary%20syndrome",  # PCOS tag
            "tag/menopause",  # Menopause tag
            "tag/mental%20health",  # Mental health
            "tag/ovarian%20cyst",
            "tag/bacterial%20vaginosis",
            "tag/vulval%20problems",
            "tag/atrophic%20vaginitis",
            "tag/genitourinary%20prolapse",
            "tag/uterine%20fibroids",
            "tag/menstrual%20cycle%20and%20disorders",
            "tag/Thyroid%20and%20parathyroid%20disorders",
            "tag/Pregnancy%20and%20genetic%20disorders",
            "c/signs-and-symptoms/30"
        ]

        headers = {
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/120.0 Safari/537.36"
            )
        }

        base_url = "https://community.patient.info/"
        new_count = 0

        for forum in forums:
            try:
                url = urljoin(base_url, forum)
                resp = requests.get(url, headers=headers, timeout=15)

                if resp.status_code != 200:
                    print(f"  ✗ {forum}: HTTP {resp.status_code}")
                    continue

                soup = BeautifulSoup(resp.text, "html.parser")

                # Discourse topic list rows
                rows = soup.find_all("tr", class_=re.compile("topic-list-item", re.I))[:15]

                for row in rows:
                    try:
                        title_link = row.find("a", class_=re.compile("title", re.I))
                        if not title_link:
                            continue

                        title = title_link.get_text(strip=True)
                        link = title_link.get("href", "")
                        if link and not link.startswith("http"):
                            link = urljoin(base_url, link)

                        disc_id = f"patient_{hash(link)}"
                        if any(d["id"] == disc_id for d in self.discussions):
                            continue

                        # Small excerpt if available
                        excerpt = row.find("span", class_=re.compile("excerpt", re.I))
                        content = excerpt.get_text(strip=True)[:800] if excerpt else ""

                        category = self.categorize_content(f"{title} {content}")

                        # Replies / posts
                        replies = 0
                        replies_td = row.find("td", class_=re.compile("posts|replies", re.I))
                        if replies_td:
                            m = re.search(r"\d+", replies_td.get_text())
                            if m:
                                replies = int(m.group())

                        # Add these 2 lines right after the replies extraction (around line 45, after num_comments)
                        date_td = row.find_all("td")[-1]  # Last cell contains Activity date [web:1]
                        post_date = date_td.get_text(strip=True) if len(row.find_all("td")) > 3 and date_td else ""

                        discussion = {
                            "id": disc_id,
                            "platform": "Patient.info",
                            "source": forum.replace("-", " ").replace("tag/", "").title(),
                            "category": category,
                            "title": title,
                            "content": content,
                            "url": link or url,
                            "author": "Forum Member",
                            "num_comments": replies,
                            "created_utc" : post_date,
                            "fetched_date": datetime.now().isoformat(),
                        }

                        discussion["engagement_score"] = self.calculate_engagement_score(discussion)
                        self.discussions.append(discussion)
                        new_count += 1

                    except Exception:
                        continue

                print(f"  ✓ {forum}: discussions found")
                time.sleep(2)

            except Exception as e:
                print(f"  ✗ {forum}: {e}")

        print(f"✅ Patient.info: {new_count} discussions")
        return new_count

    # ========== INSPIRE.COM ==========
    def fetch_inspire(self):
        print("\n💙 Fetching from Inspire.com...")

        # Correct community URLs (Inspire uses /groups/ not direct slugs)
        communities = [
            'groups/breast-cancer',
            'groups/ovarian-cancer',
            'groups/endometriosis',
            'groups/infertility',
            'groups/pregnancy-loss',
            'groups/mental-health',
            'groups/chronic-pain',
            'groups/autoimmune-disease',
            'groups/nccc-cervical-cancer',
            'groups/mypcosteam',
            'groups/breast-cancer',
            'groups/ovarian-cancer',
            'groups/endometriosis',
            'groups/diabetes'
        ]

        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
        }

        new_count = 0

        for community in communities:
            try:
                # Use correct Inspire base URL pattern
                url = f"https://www.inspire.com/{community}"
                print(f"  Fetching: {url}")
                response = requests.get(url, headers=headers, timeout=15)

                print(f"  Status: {response.status_code}")

                if response.status_code != 200:
                    print(f"  ✗ {community}: HTTP {response.status_code}")
                    continue

                soup = BeautifulSoup(response.content, 'html.parser')

                # Debug: Print page title to verify we're on right page
                title = soup.find('title')
                print(f"  Page title: {title.get_text(strip=True) if title else 'No title'}")

                # Broader selectors for Inspire's current JS-heavy structure
                posts = soup.find_all(['div', 'article', 'section'],
                                      class_=re.compile(r'(post|discussion|topic|story|update|activity|card)', re.I),
                                      limit=20)

                # Also try common Inspire patterns
                if not posts:
                    posts = soup.find_all('div', attrs={'data-testid': re.compile('post|discussion', re.I)})
                    posts += soup.select('[role="article"], [role="listitem"]')
                    posts += soup.find_all(class_=re.compile(r'stream|feed|discussion-list'))

                found_posts = 0
                for post in posts[:15]:  # Limit processing
                    try:
                        # Multiple title strategies
                        title_elem = (post.find(['h1', 'h2', 'h3', 'h4']) or
                                      post.find('a', string=re.compile(r'.{10,}')) or  # Long link text
                                      post.find(class_=re.compile(r'title|headline|name')))

                        if not title_elem or len(title_elem.get_text(strip=True)) < 10:
                            continue

                        title = title_elem.get_text(strip=True)[:200]

                        # Get link - multiple fallback strategies
                        link_elem = (title_elem.find_parent('a') if title_elem.name != 'a' else title_elem)
                        if not link_elem or link_elem.name != 'a':
                            link_elem = post.find('a', href=True)

                        link = link_elem.get('href', '') if link_elem else ''
                        if link and not link.startswith('http'):
                            link = urljoin(url, link)

                        if not link or 'inspire.com' not in link:
                            continue

                        disc_id = f"inspire_{hash(link)}"

                        # Content fallback chain
                        content_elem = (post.find(['p', 'div', 'span'],
                                                  class_=re.compile(r'content|body|text|excerpt|description', re.I)) or
                                        post.find('div', string=re.compile(r'.{50,}')) or
                                        post.select_one('[data-role="main"], .post-body'))

                        content = content_elem.get_text(strip=True)[:800] if content_elem else title[:800]
                        category = self.categorize_content(f"{title} {content}")

                        date_elem = post.find(['time', 'span'],
                                              class_=re.compile(r'(date|time|posted|activity)', re.I)) or post.find(
                            'time')
                        post_date = date_elem.get('datetime') or date_elem.get('title') or date_elem.get_text(
                            strip=True)[:20] if date_elem else ""

                        discussion = {
                            'id': disc_id,
                            'platform': 'Inspire.com',
                            'source': community.split('/')[-1].replace('-', ' ').title(),
                            "category": category,
                            'title': title,
                            'content': content,
                            'url': link,
                            'author': 'Community Member',
                            'created_utc' : post_date,
                            'fetched_date': datetime.now().isoformat()
                        }

                        discussion['engagement_score'] = self.calculate_engagement_score(discussion)
                        self.discussions.append(discussion)
                        new_count += 1
                        found_posts += 1

                    except Exception as e:
                        continue

                if found_posts > 0:
                    print(f"  ✓ {community}: {found_posts} discussions found")
                else:
                    print(f"  ⚠ {community}: page loaded but no posts matched")

                time.sleep(3)  # Increased delay for JS-heavy site

            except requests.RequestException as e:
                print(f"  ✗ {community}: Network error - {str(e)}")
            except Exception as e:
                print(f"  ✗ {community}: {str(e)}")

        print(f"✅ Inspire.com: {new_count} discussions")
        return new_count

    # ========== STACK EXCHANGE ==========
    def fetch_stack_exchange(self):
        """Fetch from Health Stack Exchange"""
        print("\n📚 Fetching from Stack Exchange...")

        tags = [
            'womens-health', 'pregnancy', 'gynecology', 'menopause',
            'contraception', 'fertility', 'menstruation', 'pcos'
        ]

        new_count = 0
        base_url = 'https://api.stackexchange.com/2.3/questions'

        for tag in tags:
            try:
                params = {
                    'order': 'desc',
                    'sort': 'activity',
                    'tagged': tag,
                    'site': 'health',
                    'pagesize': 20,
                    'filter': 'withbody'
                }

                response = requests.get(base_url, params=params, timeout=10)

                if response.status_code == 200:
                    data = response.json()
                    questions = data.get('items', [])

                    for q in questions:
                        disc_id = f"stackexchange_{q['question_id']}"

                        if any(d['id'] == disc_id for d in self.discussions):
                            continue

                        # Clean HTML from body
                        body = re.sub('<[^<]+?>', '', q.get('body', ''))[:800]
                        category = self.categorize_content(f"{q['title']} {body}")

                        discussion = {
                            'id': disc_id,
                            'platform': 'Stack Exchange',
                            'source': 'Health SE',
                            'category': category,
                            'title': q['title'],
                            'content': body,
                            'url': q['link'],
                            'author': q['owner'].get('display_name', 'User'),
                            'score': q['score'],
                            'num_comments': q['answer_count'],
                            'views': q['view_count'],
                            'created_utc': datetime.fromtimestamp(q['creation_date']).isoformat(),
                            'fetched_date': datetime.now().isoformat()
                        }

                        discussion['engagement_score'] = self.calculate_engagement_score(discussion)
                        self.discussions.append(discussion)
                        new_count += 1

                    print(f"  ✓ Tag '{tag}': {len(questions)} questions")
                    time.sleep(0.5)

            except Exception as e:
                print(f"  ✗ Tag '{tag}': {str(e)}")

        print(f"✅ Stack Exchange: {new_count} discussions")
        return new_count

    # ========== RSS FEEDS ==========
    def fetch_rss(self):
        """Fetch from health RSS feeds"""
        print("\n📰 Fetching from RSS Feeds...")

        feeds = [
            ('https://www.womenshealthmag.com/rss/all.xml/', 'General Women\'s Health'),
            ('https://www.verywellhealth.com/rss', 'General Women\'s Health'),
        ]

        new_count = 0

        for feed_url, default_category in feeds:
            try:
                feed = feedparser.parse(feed_url)

                for entry in feed.entries[:15]:
                    disc_id = f"rss_{hash(entry.link)}"

                    if any(d['id'] == disc_id for d in self.discussions):
                        continue

                    content = entry.get('summary', '')[:800]
                    category = self.categorize_content(f"{entry.title} {content}")

                    discussion = {
                        'id': disc_id,
                        'platform': 'RSS Feed',
                        'source': feed.feed.get('title', 'Health Blog'),
                        'category': category,
                        'title': entry.title,
                        'content': content,
                        'url': entry.link,
                        'author': entry.get('author', 'Staff Writer'),
                        'published_at': entry.get('published', datetime.now().isoformat()),
                        'fetched_date': datetime.now().isoformat()
                    }

                    discussion['engagement_score'] = self.calculate_engagement_score(discussion)
                    self.discussions.append(discussion)
                    new_count += 1

                print(f"  ✓ {feed.feed.get('title', 'Feed')}: {len(feed.entries[:15])} articles")

            except Exception as e:
                print(f"  ✗ Feed error: {str(e)}")

        print(f"✅ RSS Feeds: {new_count} articles")
        return new_count

    def fetch_all_platforms(self):
        """ONE-SHOT: Fetch from ALL platforms"""
        print("\n" + "="*70)
        print("🚀 COMPREHENSIVE WOMEN'S HEALTH DATA COLLECTION")
        print("="*70)
        print("Fetching from: Reddit, Mastodon, HealthUnlocked, Patient.info,")
        print("              Inspire.com, Stack Exchange, RSS Feeds")
        print("="*70)

        start_time = time.time()

        total = 0
        total += self.fetch_reddit()
        total += self.fetch_mastodon()
        total += self.fetch_patient_info()
        total += self.fetch_inspire()
        total += self.fetch_stack_exchange()
        total += self.fetch_rss()

        #total += self.fetch_healthunlocked()  Wont work


        # Sort by engagement
        self.discussions.sort(key=lambda x: x.get('engagement_score', 0), reverse=True)

        # Save data
        self.save_data()

        elapsed = time.time() - start_time

        print("\n" + "="*70)
        print(f"✅ COLLECTION COMPLETE!")
        print(f"📊 Total Discussions: {len(self.discussions)}")
        print(f"⏱️  Time Taken: {elapsed:.1f} seconds")
        print(f"🎯 Categories: {len(set(d['category'] for d in self.discussions))}")
        print(f"📱 Platforms: {len(set(d['platform'] for d in self.discussions))}")
        print("="*70)

        return total

    def save_data(self):
        """Save all data"""
        data = {
            'last_updated': datetime.now().isoformat(),
            'total': len(self.discussions),
            'discussions': self.discussions
        }

        #print("Data is:", data)

        with open(self.filename, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)

    def generate_dashboard(self):
        """Generate comprehensive HTML dashboard ranked by engagement"""
        print("\n📊 Generating dashboard...")

        if not self.discussions:
            print("❌ No data to display")
            return

        now = datetime.now()
        recent_24h = now - timedelta(days=1)
        recent_7d = now - timedelta(days=7)

        # 1) Calculate statistics
        stats = {
            'total': len(self.discussions),
            'by_platform': defaultdict(int),
            'by_category': defaultdict(int),
            'high_engagement': 0,
            'recent_24h': 0,
            'recent_7d': 0
        }

        for disc in self.discussions:
            stats['by_platform'][disc['platform']] += 1
            stats['by_category'][disc['category']] += 1
            if disc.get('engagement_score', 0) > 50:
                stats['high_engagement'] += 1

        # Group by category
        by_category = defaultdict(list)
        for disc in self.discussions:
            by_category[disc['category']].append(disc)

        # Sort each category by engagement
        for cat in by_category:
            by_category[cat].sort(key=lambda x: x.get('engagement_score', 0), reverse=True)

        # 2) DEFINE last_updated here
        last_updated = datetime.now().strftime("%B %d, %Y at %I:%M %p")

        # 3) Generate HTML
        html = f"""<!DOCTYPE html>

        <html lang="en"> <head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title>Women's Health Discussion Hub</title> <style> * {{ margin: 0; padding: 0; box-sizing: border-box; }}

            body {{
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 20px;
                min-height: 100vh;
            }}

            .container {{
                max-width: 1600px;
                margin: 0 auto;
                background: white;
                border-radius: 20px;
                overflow: hidden;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            }}

            .header {{
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 50px 40px;
                text-align: center;
            }}

            .header h1 {{
                font-size: 42px;
                margin-bottom: 15px;
                font-weight: 700;
            }}

            .header p {{
                font-size: 18px;
                opacity: 0.95;
            }}

            .header .sub {{
                font-size: 14px;
                opacity: 0.8;
                margin-top: 8px;
            }}

            .stats-bar {{
                background: #f8f9fa;
                padding: 30px 40px;
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 20px;
                border-bottom: 2px solid #e0e0e0;
            }}

            .stat-item {{
                text-align: center;
            }}

            .stat-number {{
                font-size: 36px;
                font-weight: bold;
                color: #667eea;
                margin-bottom: 5px;
            }}

            .stat-label {{
                font-size: 14px;
                color: #666;
                text-transform: uppercase;
                letter-spacing: 1px;
            }}

            .tabs {{
                display: flex;
                background: #f8f9fa;
                border-bottom: 2px solid #e0e0e0;
                overflow-x: auto;
            }}

            .tab {{
                flex: 1;
                padding: 20px;
                text-align: center;
                cursor: pointer;
                border: none;
                background: transparent;
                font-size: 16px;
                font-weight: 600;
                color: #666;
                transition: all 0.3s;
                border-bottom: 3px solid transparent;
                min-width: 150px;
            }}

            .tab:hover {{
                background: white;
                color: #667eea;
            }}

            .tab.active {{
                background: white;
                color: #667eea;
                border-bottom-color: #667eea;
            }}

            .content {{
                padding: 40px;
            }}

            .tab-pane {{
                display: none;
            }}

            .tab-pane.active {{
                display: block;
            }}

            .category-section {{
                margin-bottom: 50px;
            }}

            .category-header {{
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 25px;
                padding-bottom: 15px;
                border-bottom: 3px solid #667eea;
            }}

            .category-title {{
                font-size: 28px;
                font-weight: bold;
                color: #667eea;
                display: flex;
                align-items: center;
                gap: 10px;
            }}

            .category-count {{
                font-size: 18px;
                color: #999;
                background: #f0f0f0;
                padding: 5px 15px;
                border-radius: 20px;
            }}

            .discussions-grid {{
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
                gap: 20px;
            }}

            .discussion-card {{
                background: #f8f9fa;
                border-radius: 12px;
                padding: 25px;
                border-left: 5px solid #667eea;
                transition: all 0.3s;
                cursor: pointer;
                position: relative;
            }}

            .discussion-card:hover {{
                transform: translateY(-5px);
                box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            }}

            .discussion-header {{
                margin-bottom: 15px;
            }}

            .discussion-title {{
                font-size: 18px;
                font-weight: 600;
                color: #333;
                margin-bottom: 10px;
                line-height: 1.4;
                padding-right: 90px;
            }}

            .discussion-meta {{
                display: flex;
                gap: 10px;
                flex-wrap: wrap;
                margin-bottom: 15px;
            }}

            .badge {{
                padding: 5px 12px;
                border-radius: 15px;
                font-size: 12px;
                font-weight: 600;
            }}

            .badge-reddit {{ background: #ff4500; color: white; }}
            .badge-mastodon {{ background: #6364ff; color: white; }}
            .badge-patient {{ background: #0066cc; color: white; }}
            .badge-inspire {{ background: #00aaff; color: white; }}
            .badge-stack-exchange {{ background: #f48024; color: white; }}
            .badge-rss {{ background: #ff6600; color: white; }}

            .badge-source {{
                background: #e0e0e0;
                color: #666;
            }}

            .engagement-badge {{
                position: absolute;
                top: 15px;
                right: 15px;
                background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                color: white;
                padding: 5px 12px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 700;
            }}

            .engagement-medium {{
                background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
            }}

            .engagement-low {{
                background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
            }}

            .discussion-content {{
                color: #666;
                line-height: 1.6;
                margin-bottom: 15px;
                display: -webkit-box;
                -webkit-line-clamp: 4;
                -webkit-box-orient: vertical;
                overflow: hidden;
            }}

            .discussion-stats {{
                display: flex;
                gap: 15px;
                color: #999;
                font-size: 13px;
            }}

            .discussion-link {{
                display: inline-block;
                margin-top: 10px;
                color: #667eea;
                text-decoration: none;
                font-weight: 600;
                transition: color 0.3s;
            }}

            .discussion-link:hover {{
                color: #764ba2;
            }}

            .filter-bar {{
                background: #f8f9fa;
                padding: 20px;
                border-radius: 10px;
                margin-bottom: 30px;
                display: flex;
                gap: 10px;
                flex-wrap: wrap;
                align-items: center;
            }}

            .filter-label {{
                font-weight: 600;
                color: #666;
            }}

            .filter-btn {{
                padding: 8px 16px;
                border: 2px solid #667eea;
                background: white;
                color: #667eea;
                border-radius: 20px;
                cursor: pointer;
                font-size: 14px;
                transition: all 0.3s;
            }}

            .filter-btn:hover, .filter-btn.active {{
                background: #667eea;
                color: white;
            }}

            .platform-grid {{
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 20px;
            }}

            .platform-card {{
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 30px;
                border-radius: 12px;
                text-align: center;
            }}

            .platform-name {{
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 10px;
            }}

            .platform-count {{
                font-size: 42px;
                font-weight: bold;
                margin-bottom: 10px;
            }}

            .platform-label {{
                font-size: 14px;
                opacity: 0.9;
            }}

            @media (max-width: 768px) {{
                .discussions-grid {{
                    grid-template-columns: 1fr;
                }}

                .stats-bar {{
                    grid-template-columns: 1fr 1fr;
                }}
            }}
        </style>
        </head> <body> <div class="container"> <div class="header"> <h1>💬 Women's Health Discussion Hub</h1> <p>Aggregated from Reddit, Mastodon, Patient.info, Inspire, Stack Exchange & RSS</p> <p class="sub">Last Updated {last_updated}</p> </div>

            <div class="stats-bar">
                <div class="stat-item">
                    <div class="stat-number">{stats['total']}</div>
                    <div class="stat-label">Total Discussions</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">{len(stats['by_platform'])}</div>
                    <div class="stat-label">Platforms</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">{len(stats['by_category'])}</div>
                    <div class="stat-label">Categories</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">{stats['recent_24h']}</div>
                    <div class="stat-label">Last 24 Hours</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">{stats['recent_7d']}</div>
                    <div class="stat-label">Last 7 Days</div>
                </div>
            </div>

            <div class="tabs">
                <button class="tab active" onclick="showTab(0)">📋 All Discussions</button>
                <button class="tab" onclick="showTab(1)">🏥 By Condition</button>
                <button class="tab" onclick="showTab(2)">📱 By Platform</button>
                <button class="tab" onclick="showTab(3)">📊 Analytics</button>
            </div>

            <div class="content">
                <!-- Tab 0: All Discussions -->
                <div class="tab-pane active" id="tab-0">
                    <div class="filter-bar">
                        <span class="filter-label">Filter by platform:</span>
                        <button class="filter-btn active" onclick="filterPlatform('all')">All</button>
                        <button class="filter-btn" onclick="filterPlatform('Reddit')">Reddit</button>
                        <button class="filter-btn" onclick="filterPlatform('Mastodon')">Mastodon</button>
                        <button class="filter-btn" onclick="filterPlatform('Patient.info')">Patient.info</button>
                        <button class="filter-btn" onclick="filterPlatform('Inspire.com')">Inspire</button>
                        <button class="filter-btn" onclick="filterPlatform('Stack Exchange')">Stack Exchange</button>
                        <button class="filter-btn" onclick="filterPlatform('RSS')">RSS</button>

                        <span class="filter-label" style="margin-left:20px;">By condition:</span>
                        <select id="condition-filter">
                            <option value="all">All</option>"""
        for cond in sorted(stats["by_category"].keys()):
            html += f"""
        <option value="{cond}">{cond}</option>"""

        html += """
        </select>

                        <input id="search-input" type="text"
                               placeholder="Search groups (2–3 keywords)..."
                               style="flex:1; min-width:220px; padding:8px 12px; border-radius:20px; border:1px solid #ccc;">
                    </div>

                    <div class="discussions-grid" id="all-discussions">
        """

        recent = sorted(self.discussions, key=lambda x: x.get("fetched_date", ""), reverse=True)[:200]

        for disc in recent:
            platform = disc["platform"]
        platform_key = platform.lower().replace(" ", "-").replace(".com", "")
        if platform_key == "stackexchange":
            platform_key = "stack-exchange"
        condition = disc.get("condition", "General")
        engagement_score = disc.get("engagement_score", 0)
        band = disc.get("engagement_band", "low")

        html += f"""
                        <div class="discussion-card"
                             data-platform="{platform}"
                             data-condition="{condition}">
                            <span class="engagement-badge engagement-{band}">{engagement_score}</span>
                            <div class="discussion-header">
                                <div class="discussion-title">{disc['title']}</div>
                                <div class="discussion-meta">
                                    <span class="badge badge-{platform_key}">{platform}</span>
                                    <span class="badge badge-source">{disc.get('source', '')}</span>
                                </div>
                            </div>
                            <div class="discussion-content">{disc.get('content', 'No content available')}</div>
                            <div class="discussion-stats">"""

        if "score" in disc:
            html += f"<span>⬆️ {disc['score']}</span>"
        if "num_comments" in disc:
            html += f"<span>💬 {disc['num_comments']}</span>"
        if "replies" in disc:
            html += f"<span>💬 {disc['replies']}</span>"

        html += f"""
                            </div>
                            <a href="{disc['url']}" target="_blank" class="discussion-link">Read More →</a>
                        </div>
        """

        html += """
        </div>
        </div>


                <!-- Tab 1: By Condition -->
                <div class="tab-pane" id="tab-1">
        """

        for category, discs in sorted(by_category.items(), key=lambda x: len(x), reverse=True):

            html += f"""
        <div class="category-section">
        <div class="category-header">
        <div class="category-title">
        <span>🏥</span>
        <span>{category}</span>
        </div>
        <div class="category-count">{len(discs)} discussions</div>
        </div>
        <div class="discussions-grid">
        """

            for disc in discs[:30]:
                platform = disc["platform"]
                platform_key = platform.lower().replace(" ", "-").replace(".com", "")
                if platform_key == "stackexchange":
                    platform_key = "stack-exchange"
                engagement_score = disc.get("engagement_score", 0)
                band = disc.get("engagement_band", "low")

                html += f"""
                            <div class="discussion-card"
                                 data-platform="{platform}"
                                 data-condition="{category}">
                                <span class="engagement-badge engagement-{band}">{engagement_score}</span>
                                <div class="discussion-header">
                                    <div class="discussion-title">{disc['title']}</div>
                                    <div class="discussion-meta">
                                        <span class="badge badge-{platform_key}">{platform}</span>
                                        <span class="badge badge-source">{disc.get('source', '')}</span>
                                    </div>
                                </div>
                                <div class="discussion-content">{disc.get('content', 'No content available')}</div>
                                <a href="{disc['url']}" target="_blank" class="discussion-link">Read More →</a>
                            </div>
        """

            html += """
                        </div>
                    </div>
        """

            html += """
        </div>


                <!-- Tab 2: By Platform -->
                <div class="tab-pane" id="tab-2">
                    <div class="platform-grid">
        """

            for platform, count in sorted(stats["by_platform"].items(), key=lambda x: x, reverse=True):

                html += f"""
        <div class="platform-card">
        <div class="platform-name">{platform}</div>
        <div class="platform-count">{count}</div>
        <div class="platform-label">Discussions</div>
        </div>
        """

                html += """
        </div>
        </div>


                <!-- Tab 3: Analytics -->
                <div class="tab-pane" id="tab-3">
                    <div class="category-section">
                        <h2 class="category-title">📊 Condition Distribution</h2>
                        <div style="margin-top: 20px;">
        """

                max_count = max(stats["by_category"].values()) if stats["by_category"] else 1

                for category, count in sorted(stats["by_category"].items(), key=lambda x: x, reverse=True):

                    percentage = (count / stats["total"] * 100) if stats["total"] > 0 else 0
                    bar_width = (count / max_count * 100) if max_count > 0 else 0

                    # 3) Generate HTML
                    html = f"""<!DOCTYPE html>
                      <html lang="en">
                      <head>
                          <meta charset="UTF-8">
                          <meta name="viewport" content="width=device-width, initial-scale=1.0">
                          <title>Women's Health Discussion Hub</title>
                          <style>
                              * {{ margin: 0; padding: 0; box-sizing: border-box; }}

                              body {{
                                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                                  padding: 20px;
                                  min-height: 100vh;
                              }}

                              .container {{
                                  max-width: 1600px;
                                  margin: 0 auto;
                                  background: white;
                                  border-radius: 20px;
                                  overflow: hidden;
                                  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                              }}

                              .header {{
                                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                                  color: white;
                                  padding: 50px 40px;
                                  text-align: center;
                              }}

                              .header h1 {{
                                  font-size: 42px;
                                  margin-bottom: 15px;
                                  font-weight: 700;
                              }}

                              .header p {{
                                  font-size: 18px;
                                  opacity: 0.95;
                              }}

                              .header .sub {{
                                  font-size: 14px;
                                  opacity: 0.8;
                                  margin-top: 8px;
                              }}

                              .stats-bar {{
                                  background: #f8f9fa;
                                  padding: 30px 40px;
                                  display: grid;
                                  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                                  gap: 20px;
                                  border-bottom: 2px solid #e0e0e0;
                              }}

                              .stat-item {{
                                  text-align: center;
                              }}

                              .stat-number {{
                                  font-size: 36px;
                                  font-weight: bold;
                                  color: #667eea;
                                  margin-bottom: 5px;
                              }}

                              .stat-label {{
                                  font-size: 14px;
                                  color: #666;
                                  text-transform: uppercase;
                                  letter-spacing: 1px;
                              }}

                              .tabs {{
                                  display: flex;
                                  background: #f8f9fa;
                                  border-bottom: 2px solid #e0e0e0;
                                  overflow-x: auto;
                              }}

                              .tab {{
                                  flex: 1;
                                  padding: 20px;
                                  text-align: center;
                                  cursor: pointer;
                                  border: none;
                                  background: transparent;
                                  font-size: 16px;
                                  font-weight: 600;
                                  color: #666;
                                  transition: all 0.3s;
                                  border-bottom: 3px solid transparent;
                                  min-width: 150px;
                              }}

                              .tab:hover {{
                                  background: white;
                                  color: #667eea;
                              }}

                              .tab.active {{
                                  background: white;
                                  color: #667eea;
                                  border-bottom-color: #667eea;
                              }}

                              .content {{
                                  padding: 40px;
                              }}

                              .tab-pane {{
                                  display: none;
                              }}

                              .tab-pane.active {{
                                  display: block;
                              }}

                              .category-section {{
                                  margin-bottom: 50px;
                              }}

                              .category-header {{
                                  display: flex;
                                  align-items: center;
                                  justify-content: space-between;
                                  margin-bottom: 25px;
                                  padding-bottom: 15px;
                                  border-bottom: 3px solid #667eea;
                              }}

                              .category-title {{
                                  font-size: 28px;
                                  font-weight: bold;
                                  color: #667eea;
                                  display: flex;
                                  align-items: center;
                                  gap: 10px;
                              }}

                              .category-count {{
                                  font-size: 18px;
                                  color: #999;
                                  background: #f0f0f0;
                                  padding: 5px 15px;
                                  border-radius: 20px;
                              }}

                              .discussions-grid {{
                                  display: grid;
                                  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
                                  gap: 20px;
                              }}

                              .discussion-card {{
                                  background: #f8f9fa;
                                  border-radius: 12px;
                                  padding: 25px;
                                  border-left: 5px solid #667eea;
                                  transition: all 0.3s;
                                  cursor: pointer;
                                  position: relative;
                              }}

                              .discussion-card:hover {{
                                  transform: translateY(-5px);
                                  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                              }}

                              .discussion-header {{
                                  margin-bottom: 15px;
                              }}

                              .discussion-title {{
                                  font-size: 18px;
                                  font-weight: 600;
                                  color: #333;
                                  margin-bottom: 10px;
                                  line-height: 1.4;
                                  padding-right: 90px;
                              }}

                              .discussion-meta {{
                                  display: flex;
                                  gap: 10px;
                                  flex-wrap: wrap;
                                  margin-bottom: 15px;
                              }}

                              .badge {{
                                  padding: 5px 12px;
                                  border-radius: 15px;
                                  font-size: 12px;
                                  font-weight: 600;
                              }}

                              .badge-reddit {{ background: #ff4500; color: white; }}
                              .badge-mastodon {{ background: #6364ff; color: white; }}
                              .badge-patient {{ background: #0066cc; color: white; }}
                              .badge-inspire {{ background: #00aaff; color: white; }}
                              .badge-stack {{ background: #f48024; color: white; }}
                              .badge-rss {{ background: #ff6600; color: white; }}

                              .badge-source {{
                                  background: #e0e0e0;
                                  color: #666;
                              }}

                              .engagement-badge {{
                                  position: absolute;
                                  top: 15px;
                                  right: 15px;
                                  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                                  color: white;
                                  padding: 5px 12px;
                                  border-radius: 20px;
                                  font-size: 12px;
                                  font-weight: 700;
                              }}

                              .engagement-medium {{
                                  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
                              }}

                              .engagement-low {{
                                  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
                              }}

                              .discussion-content {{
                                  color: #666;
                                  line-height: 1.6;
                                  margin-bottom: 15px;
                                  display: -webkit-box;
                                  -webkit-line-clamp: 4;
                                  -webkit-box-orient: vertical;
                                  overflow: hidden;
                              }}

                              .discussion-stats {{
                                  display: flex;
                                  gap: 15px;
                                  color: #999;
                                  font-size: 13px;
                              }}

                              .discussion-link {{
                                  display: inline-block;
                                  margin-top: 10px;
                                  color: #667eea;
                                  text-decoration: none;
                                  font-weight: 600;
                                  transition: color 0.3s;
                              }}

                              .discussion-link:hover {{
                                  color: #764ba2;
                              }}

                              .filter-bar {{
                                  background: #f8f9fa;
                                  padding: 20px;
                                  border-radius: 10px;
                                  margin-bottom: 30px;
                                  display: flex;
                                  gap: 10px;
                                  flex-wrap: wrap;
                                  align-items: center;
                              }}

                              .filter-label {{
                                  font-weight: 600;
                                  color: #666;
                              }}

                              .filter-btn {{
                                  padding: 8px 16px;
                                  border: 2px solid #667eea;
                                  background: white;
                                  color: #667eea;
                                  border-radius: 20px;
                                  cursor: pointer;
                                  font-size: 14px;
                                  transition: all 0.3s;
                              }}

                              .filter-btn:hover, .filter-btn.active {{
                                  background: #667eea;
                                  color: white;
                              }}

                              .platform-grid {{
                                  display: grid;
                                  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                                  gap: 20px;
                              }}

                              .platform-card {{
                                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                                  color: white;
                                  padding: 30px;
                                  border-radius: 12px;
                                  text-align: center;
                              }}

                              .platform-name {{
                                  font-size: 24px;
                                  font-weight: bold;
                                  margin-bottom: 10px;
                              }}

                              .platform-count {{
                                  font-size: 42px;
                                  font-weight: bold;
                                  margin-bottom: 10px;
                              }}

                              .platform-label {{
                                  font-size: 14px;
                                  opacity: 0.9;
                              }}

                              @media (max-width: 768px) {{
                                  .discussions-grid {{
                                      grid-template-columns: 1fr;
                                  }}

                                  .stats-bar {{
                                      grid-template-columns: 1fr 1fr;
                                  }}
                              }}
                          </style>
                      </head>
                      <body>
                          <div class="container">
                              <div class="header">
                                  <h1>💬 Women's Health Discussion Hub</h1>
                                  <p>Aggregated from Reddit, Mastodon, Patient.info, Inspire, Stack Exchange & RSS</p>
                                  <p class="sub">Last Updated {last_updated}</p>
                              </div>

                              <div class="stats-bar">
                                  <div class="stat-item">
                                      <div class="stat-number">{stats['total']}</div>
                                      <div class="stat-label">Total Discussions</div>
                                  </div>
                                  <div class="stat-item">
                                      <div class="stat-number">{len(stats['by_platform'])}</div>
                                      <div class="stat-label">Platforms</div>
                                  </div>
                                  <div class="stat-item">
                                      <div class="stat-number">{len(stats['by_category'])}</div>
                                      <div class="stat-label">Categories</div>
                                  </div>
                                  <div class="stat-item">
                                      <div class="stat-number">{stats['recent_24h']}</div>
                                      <div class="stat-label">Last 24 Hours</div>
                                  </div>
                                  <div class="stat-item">
                                      <div class="stat-number">{stats['recent_7d']}</div>
                                      <div class="stat-label">Last 7 Days</div>
                                  </div>
                              </div>

                              <div class="tabs">
                                  <button class="tab active" onclick="showTab(0)">📋 All Discussions</button>
                                  <button class="tab" onclick="showTab(1)">🏥 By Condition</button>
                                  <button class="tab" onclick="showTab(2)">📱 By Platform</button>
                                  <button class="tab" onclick="showTab(3)">📊 Analytics</button>
                              </div>

                              <div class="content">
                                  <!-- Tab 0: All Discussions -->
                                  <div class="tab-pane active" id="tab-0">
                                      <div class="filter-bar">
                                          <span class="filter-label">Filter by platform:</span>
                                          <button class="filter-btn active" onclick="filterPlatform('all')">All</button>
                                          <button class="filter-btn" onclick="filterPlatform('Reddit')">Reddit</button>
                                          <button class="filter-btn" onclick="filterPlatform('Mastodon')">Mastodon</button>
                                          <button class="filter-btn" onclick="filterPlatform('Patient.info')">Patient.info</button>
                                          <button class="filter-btn" onclick="filterPlatform('Inspire.com')">Inspire</button>
                                          <button class="filter-btn" onclick="filterPlatform('StackExchange')">Stack Exchange</button>
                                          <button class="filter-btn" onclick="filterPlatform('RSS')">RSS</button>

                                          <span class="filter-label" style="margin-left:20px;">By condition:</span>
                                          <select id="condition-filter">
                                              <option value="all">All</option>"""

                    # condition options
                    for cond in sorted(stats["by_category"].keys()):
                        html += f"""
                                              <option value="{cond}">{cond}</option>"""

                    html += """
                                          </select>

                                          <input id="search-input" type="text"
                                                 placeholder="Search groups (2–3 keywords)..."
                                                 style="flex:1; min-width:220px; padding:8px 12px; border-radius:20px; border:1px solid #ccc;">
                                      </div>

                                      <div class="discussions-grid" id="all-discussions">
                      """

                    # recent discussions from all platforms
                    recent = sorted(self.discussions, key=lambda x: x.get("fetched_date", ""), reverse=True)[:200]

                    for disc in recent:
                        platform_class = disc["platform"].lower().replace(" ", "-")
                        condition = disc.get("condition", "General")
                        engagement_score = disc.get("engagement_score", 0)
                        band = disc.get("engagement_band", "low")  # "high" / "medium" / "low"

                        html += f"""
                                          <div class="discussion-card"
                                               data-platform="{disc['platform']}"
                                               data-condition="{condition}">
                                              <span class="engagement-badge engagement-{band}">{engagement_score}</span>
                                              <div class="discussion-header">
                                                  <div class="discussion-title">{disc['title']}</div>
                                                  <div class="discussion-meta">
                                                      <span class="badge badge-{platform_class}">{disc['platform']}</span>
                                                      <span class="badge badge-source">{disc.get('source', '')}</span>
                                                  </div>
                                              </div>
                                              <div class="discussion-content">{disc.get('content', 'No content available')}</div>
                                              <div class="discussion-stats">"""

                        if "score" in disc:
                            html += f"<span>⬆️ {disc['score']}</span>"
                        if "num_comments" in disc:
                            html += f"<span>💬 {disc['num_comments']}</span>"
                        if "replies" in disc:
                            html += f"<span>💬 {disc['replies']}</span>"

                        html += f"""
                                              </div>
                                              <a href="{disc['url']}" target="_blank" class="discussion-link">Read More →</a>
                                          </div>
                      """

                    html += """
                                      </div>
                                  </div>

                                  <!-- Tab 1: By Condition -->
                                  <div class="tab-pane" id="tab-1">
                      """

                    # group by condition (you can precompute by_category from all fetch_* outputs)
                    for category, discs in sorted(by_category.items(), key=lambda x: len(x[1]), reverse=True):
                        html += f"""
                                      <div class="category-section">
                                          <div class="category-header">
                                              <div class="category-title">
                                                  <span>🏥</span>
                                                  <span>{category}</span>
                                              </div>
                                              <div class="category-count">{len(discs)} discussions</div>
                                          </div>
                                          <div class="discussions-grid">
                      """

                        for disc in discs[:30]:
                            platform_class = disc["platform"].lower().replace(" ", "-")
                            engagement_score = disc.get("engagement_score", 0)
                            band = disc.get("engagement_band", "low")

                            html += f"""
                                              <div class="discussion-card"
                                                   data-platform="{disc['platform']}"
                                                   data-condition="{category}">
                                                  <span class="engagement-badge engagement-{band}">{engagement_score}</span>
                                                  <div class="discussion-header">
                                                      <div class="discussion-title">{disc['title']}</div>
                                                      <div class="discussion-meta">
                                                          <span class="badge badge-{platform_class}">{disc['platform']}</span>
                                                          <span class="badge badge-source">{disc.get('source', '')}</span>
                                                      </div>
                                                  </div>
                                                  <div class="discussion-content">{disc.get('content', 'No content available')}</div>
                                                  <a href="{disc['url']}" target="_blank" class="discussion-link">Read More →</a>
                                              </div>
                      """

                        html += """
                                          </div>
                                      </div>
                      """

                    html += """
                                  </div>

                                  <!-- Tab 2: By Platform -->
                                  <div class="tab-pane" id="tab-2">
                                      <div class="platform-grid">
                      """

                    for platform, count in sorted(stats["by_platform"].items(), key=lambda x: x[1], reverse=True):
                        html += f"""
                                          <div class="platform-card">
                                              <div class="platform-name">{platform}</div>
                                              <div class="platform-count">{count}</div>
                                              <div class="platform-label">Discussions</div>
                                          </div>
                      """

                    html += """
                                      </div>
                                  </div>

                                  <!-- Tab 3: Analytics -->
                                  <div class="tab-pane" id="tab-3">
                                      <div class="category-section">
                                          <h2 class="category-title">📊 Condition Distribution</h2>
                                          <div style="margin-top: 20px;">
                      """

                    max_count = max(stats["by_category"].values()) if stats["by_category"] else 1

                    for category, count in sorted(stats["by_category"].items(), key=lambda x: x[1], reverse=True):
                        percentage = (count / stats["total"] * 100) if stats["total"] > 0 else 0
                        bar_width = (count / max_count * 100) if max_count > 0 else 0

                        html += f"""
                                              <div style="margin-bottom: 25px;">
                                                  <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                                      <span style="font-weight: 600; color: #333;">{category}</span>
                                                      <span style="color: #666;">{count} discussions ({percentage:.1f}%)</span>
                                                  </div>
                                                  <div style="background: #e0e0e0; height: 35px; border-radius: 20px; overflow: hidden;">
                                                      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                                                                  width: {bar_width}%; height: 100%; transition: width 0.5s;
                                                                  display: flex; align-items: center; padding-left: 15px;
                                                                  color: white; font-weight: 600;"></div>
                                                  </div>
                                              </div>
                      """

                    html += """
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </div>

                          <script>
                              function showTab(index) {
                                  document.querySelectorAll('.tab-pane').forEach(pane => {
                                      pane.classList.remove('active');
                                  });
                                  document.querySelectorAll('.tab').forEach(tab => {
                                      tab.classList.remove('active');
                                  });

                                  document.getElementById('tab-' + index).classList.add('active');
                                  document.querySelectorAll('.tab')[index].classList.add('active');
                              }

                              function applyFilters() {
                                  const activeBtn = document.querySelector('.filter-btn.active');
                                  const platform = activeBtn ? activeBtn.textContent.trim().replace(' RSS', 'RSS') : 'all';
                                  const condition = document.getElementById('condition-filter').value || 'all';
                                  const q = (document.getElementById('search-input').value || '').toLowerCase().trim();

                                  const cards = document.querySelectorAll('#all-discussions .discussion-card');
                                  cards.forEach(card => {
                                      const cardPlatform = card.dataset.platform || '';
                                      const cardCondition = (card.dataset.condition || '').toLowerCase();
                                      const text = (card.innerText || '').toLowerCase();

                                      const platformOk = (platform === 'all') || (cardPlatform === platform);
                                      const conditionOk = (condition === 'all') || (cardCondition === condition.toLowerCase());

                                      let searchOk = true;
                                      if (q.length >= 2) {
                                          const parts = q.split(/\\s+/).filter(x => x.length > 1);
                                          searchOk = parts.every(p => text.includes(p));
                                      }

                                      card.style.display = (platformOk && conditionOk && searchOk) ? 'block' : 'none';
                                  });
                              }

                              function filterPlatform(platform) {
                                  const buttons = document.querySelectorAll('.filter-btn');
                                  buttons.forEach(btn => btn.classList.remove('active'));
                                  event.target.classList.add('active');
                                  applyFilters();
                              }

                              document.getElementById('condition-filter').addEventListener('change', applyFilters);
                              document.getElementById('search-input').addEventListener('input', function () {
                                  const v = this.value;
                                  if (v.length >= 2 || v.length === 0) {
                                      applyFilters();
                                  }
                              });
                          </script>
                      </body>
                      </html>"""

        filename = 'womens_health_hub.html'
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(html)

        print(f"✅ Dashboard generated: {filename}")
        print(f"📊 {stats['total']} discussions across {len(stats['by_category'])} categories")
        print(f"📱 Data from {len(stats['by_platform'])} platforms")

        webbrowser.open(filename)


def main():
    print("""
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║     COMPREHENSIVE WOMEN'S HEALTH DISCUSSION AGGREGATOR       ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝

🎯 ONE-SHOT EXECUTION - Run once, get everything!

📱 PLATFORMS COVERED:
   ✅ Reddit (12+ women's health subreddits)
   ✅ Mastodon (federated health communities)
   ✅ HealthUnlocked (disease-specific communities)
   ✅ Patient.info (UK medical forums)
   ✅ Inspire.com (patient support communities)
   ✅ Stack Exchange Health
   ✅ RSS Feeds (health blogs & news)

🏥 HEALTH CONDITIONS (Complete Coverage):
   • PCOS & Endometriosis
   • Breast, Cervical & Ovarian Cancer
   • Pregnancy, Fertility & Infertility
   • Menopause & Perimenopause
   • Thyroid Disorders (Hypo/Hyper)
   • UTI, Yeast Infections, Bacterial Vaginosis
   • PMS, PMDD & Menstrual Issues
   • Mental Health (Anxiety, Depression, PPD)
   • Autoimmune Diseases
   • Fibromyalgia & Chronic Pain
   • Uterine Fibroids & Ovarian Cysts
   • Gestational Diabetes & Preeclampsia
   • And 15+ more conditions!

✨ FEATURES:
   🔥 Ranked by engagement score
   📊 Beautiful interactive dashboard
   🎯 Auto-categorization by condition
   💾 All data saved to JSON
   🚀 Fully automated - no manual entry

⚡ INSTALLATION:
   pip install requests beautifulsoup4 feedparser lxml

🚀 USAGE:
   This will automatically:
   1. Fetch from all 7 platforms
   2. Collect 500+ discussions
   3. Rank by engagement
   4. Generate HTML dashboard
   5. Open in your browser

   Estimated time: 3-5 minutes
    """)

    input("\nPress Enter to start collection...")

    try:
        aggregator = ComprehensiveHealthAggregator()
        aggregator.fetch_all_platforms()
        aggregator.generate_dashboard()

        print("\n✅ COMPLETE! Dashboard opened in your browser.")
        print("💾 Data saved to: complete_health_data.json")
        print("\n🔄 Run again anytime to fetch fresh discussions!")

    except KeyboardInterrupt:
        print("\n\n⚠️  Interrupted by user")
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        print("\nMake sure you have installed:")
        print("pip install requests beautifulsoup4 feedparser lxml")


if __name__ == "__main__":
    main()