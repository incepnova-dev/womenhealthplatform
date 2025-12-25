import json
import time
import random
from pathlib import Path
from typing import Dict, Any, List, Callable

import requests
from bs4 import BeautifulSoup

INPUT_FILE = Path("womenhealthproducts.json")
OUTPUT_FILE = Path("womenhealthproducts_updated.json")
HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/122.0 Safari/537.36"
    )
}
REQUEST_TIMEOUT = 10
SLEEP_BETWEEN_CALLS = (1, 3)  # seconds, min/max


# --- SCRAPER HELPERS ---------------------------------------------------------

SCRAPER_ENDPOINT = "https://api.scrapeops.io/v1/"
API_KEY = "YOUR_KEY"

def fetch_page_via_scraper(url: str) -> str | None:
    params = {
        "api_key": API_KEY,
        "url": url,
        "country": "in",
    }
    r = requests.get(SCRAPER_ENDPOINT, params=params, timeout=20)
    if r.status_code == 200:
        return r.text
    print("Scraper error:", r.status_code, r.text[:200])
    return None

def fetch_page(url: str) -> BeautifulSoup | None:
    """Fetch a page and return BeautifulSoup object, or None on failure."""
    try:
        resp = requests.get(url, headers=HEADERS, timeout=REQUEST_TIMEOUT)
        resp.raise_for_status()
        return BeautifulSoup(resp.text, "html.parser")
    except Exception as e:
        print(f"[WARN] Failed to fetch {url}: {e}")
        return None


def parse_amazon(soup: BeautifulSoup) -> Dict[str, Any]:
    """
    Extract a rough price range, rating and delivery from an Amazon search page.
    This is intentionally fragile and may need adjustment if Amazon layout changes.
    """
    if soup is None:
        return {}

    prices = []
    ratings = []
    delivery = None

    # price
    for span in soup.select("span.a-price-whole"):
        txt = span.get_text(strip=True).replace(",", "")
        if txt.isdigit():
            prices.append(int(txt))

    # rating
    for span in soup.select("span.a-icon-alt"):
        txt = span.get_text(strip=True)
        # e.g. "4.3 out of 5 stars"
        if "out of 5" in txt:
            try:
                ratings.append(float(txt.split(" ")[0]))
            except ValueError:
                continue

    # delivery text (very heuristic)
    delivery_span = soup.find("span", string=lambda x: x and "day" in x.lower())
    if delivery_span:
        delivery = delivery_span.get_text(strip=True)

    data: Dict[str, Any] = {}
    if prices:
        data["priceRange"] = f"₹{min(prices)}-{max(prices)}"
    if ratings:
        avg_rating = sum(ratings) / len(ratings)
        data["rating"] = round(avg_rating, 1)
    if delivery:
        data["delivery"] = delivery
    # inStock is hard to infer from search, assume True if results exist
    data["inStock"] = bool(prices or ratings)

    return data


def parse_generic_search(soup: BeautifulSoup) -> Dict[str, Any]:
    """
    Fallback parser for sites where exact scraping strategy is not defined.
    Uses a simple heuristic similar to Amazon but more generic.
    """
    if soup is None:
        return {}

    prices = []
    ratings = []

    # find any "₹xxx" patterns
    for el in soup.find_all(string=True):
        text = el.strip()
        if "₹" in text:
            # crude extraction of numbers after ₹
            try:
                part = text.split("₹", 1)[1]
                num = ""
                for ch in part:
                    if ch.isdigit():
                        num += ch
                    elif num:
                        break
                if num:
                    prices.append(int(num))
            except Exception:
                continue

    # find ratings like "4.3/5" or "4.3 out of 5"
    for el in soup.find_all(string=True):
        t = el.strip()
        if "/5" in t:
            try:
                val = float(t.split("/")[0])
                ratings.append(val)
            except Exception:
                continue
        elif "out of 5" in t:
            try:
                val = float(t.split(" ")[0])
                ratings.append(val)
            except Exception:
                continue

    data: Dict[str, Any] = {}
    if prices:
        data["priceRange"] = f"₹{min(prices)}-{max(prices)}"
    if ratings:
        avg_rating = sum(ratings) / len(ratings)
        data["rating"] = round(avg_rating, 1)
    data["inStock"] = bool(prices or ratings)
    # delivery left unchanged (site-specific patterning would be needed)
    return data


# Map of domain -> parser
DOMAIN_PARSERS: Dict[str, Callable[[BeautifulSoup], Dict[str, Any]]] = {
    "amazon.in": parse_amazon,
    # For now, other domains use the generic parser; you can create
    # site-specific ones (flipkart, 1mg, pharmeasy, nykaa, etc.)
}


def choose_parser(url: str) -> Callable[[BeautifulSoup], Dict[str, Any]]:
    for domain, parser in DOMAIN_PARSERS.items():
        if domain in url:
            return parser
    return parse_generic_search


# --- MAIN REFRESH LOGIC ------------------------------------------------------

def refresh_sites_for_product(product: Dict[str, Any]) -> None:
    """
    Given a product dict (with a 'sites' list), update each site entry in-place
    using live data from the corresponding 'link' URL.
    All existing keys are preserved; only dynamic fields are overwritten if found.
    """
    sites: List[Dict[str, Any]] = product.get("sites", [])
    for site in sites:
        url = site.get("link")
        if not url:
            continue

        print(f"[INFO] Updating {product.get('name')} | {site.get('name')} -> {url}")
        soup = fetch_page(url)
        parser = choose_parser(url)
        parsed = parser(soup)

        # overwrite dynamic fields if parser returned values
        for key in ("priceRange", "rating", "inStock", "delivery"):
            if key in parsed:
                site[key] = parsed[key]

        # polite delay to avoid hammering sites
        time.sleep(random.uniform(*SLEEP_BETWEEN_CALLS))


def main():
    # 1. Load original JSON exactly as is
    with INPUT_FILE.open("r", encoding="utf-8") as f:
        data = json.load(f)

    # 2. Iterate over products and refresh per-site info
    products: List[Dict[str, Any]] = data.get("products", [])
    for product in products:
        refresh_sites_for_product(product)

    # 3. Write back JSON with same structure (categories + products)
    #    json.dump preserves keys per object as they exist in memory.
    #    Since we never change key names or nesting, structure remains 100%.
    with OUTPUT_FILE.open("w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"[DONE] Updated data written to {OUTPUT_FILE}")


if __name__ == "__main__":
    main()