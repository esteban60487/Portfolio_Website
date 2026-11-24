// The 20 SQL queries from the Restaurant Sales Analysis project, plus the query viewer.
const QUERIES = [
    {
        "n": 1,
        "topic": "Counts",
        "q": "How many unique orders were placed?",
        "note": "Counts each order_id once, so an order with many items still counts as one order.",
        "sql": "SELECT\n    COUNT(DISTINCT order_id) AS total_orders\nFROM\n    order_details;"
    },
    {
        "n": 2,
        "topic": "Counts",
        "q": "How many order-detail records are there?",
        "note": "Counts the rows in order_details. One order can have several rows.",
        "sql": "SELECT\n    COUNT(order_details_id) AS total_order_details\nFROM\n    order_details;"
    },
    {
        "n": 3,
        "topic": "Counts",
        "q": "How many different menu items were ordered?",
        "note": "Uses COUNT(DISTINCT ...) to see how many different menu items were ordered.",
        "sql": "SELECT\n    COUNT(DISTINCT item_id) AS unique_item_ordered\nFROM\n    order_details;"
    },
    {
        "n": 4,
        "topic": "Counts",
        "q": "What is the total number of items ordered?",
        "note": "Counts every ordered item, including repeats of the same item.",
        "sql": "SELECT\n    COUNT(item_id) AS total_items_ordered\nFROM\n    order_details;"
    },
    {
        "n": 5,
        "topic": "Menu & prices",
        "q": "How many menu items are in each category?",
        "note": "Groups menu_items by category and counts the items in each one.",
        "sql": "SELECT\n    category, COUNT(menu_item_id) AS items_per_category\nFROM\n    menu_items\nGROUP BY\n    category;"
    },
    {
        "n": 6,
        "topic": "Menu & prices",
        "q": "What is the average price of menu items in each category?",
        "note": "Takes the average price per category and rounds it to 2 decimals.",
        "sql": "SELECT\n    category, ROUND(AVG(price), 2) AS average_price\nFROM\n    menu_items\nGROUP BY\n    category;"
    },
    {
        "n": 7,
        "topic": "Menu & prices",
        "q": "What are the most expensive menu items?",
        "note": "Sorts by price from high to low and keeps the top 5.",
        "sql": "SELECT\n    item_name, category, price\nFROM\n    menu_items\nORDER BY\n    price DESC\nlimit\n    5;"
    },
    {
        "n": 8,
        "topic": "Menu & prices",
        "q": "What are the least expensive menu items?",
        "note": "Sorts by price from low to high and keeps the first 5.",
        "sql": "SELECT\n    item_name, category, price\nFROM\n    menu_items\nORDER BY\n    price ASC\nlimit\n    5;"
    },
    {
        "n": 9,
        "topic": "Revenue",
        "q": "Which menu items were ordered the most?",
        "note": "Joins order_details to menu_items, then counts how many times each item was ordered.",
        "sql": "SELECT\n    menu_items.item_name,\n    COUNT(order_details.item_id) AS item_count,\n    menu_items.price\nFROM\n    order_details\nJOIN menu_items\n    ON order_details.item_id = menu_items.menu_item_id\nGROUP BY\n    menu_items.item_name,\n    menu_items.price\nORDER BY\n    item_count DESC\nLIMIT\n    5;"
    },
    {
        "n": 10,
        "topic": "Revenue",
        "q": "Which menu items generated the most revenue?",
        "note": "Adds up the price of every order of an item to get its total revenue.",
        "sql": "SELECT\n    menu_items.item_name,\n    COUNT(order_details.item_id) AS times_ordered,\n    menu_items.price,\n    SUM(menu_items.price) AS total_revenue\nFROM\n    order_details\nJOIN menu_items\n    ON order_details.item_id = menu_items.menu_item_id\nGROUP BY\n    menu_items.item_name,\n    menu_items.price\nORDER BY\n    total_revenue DESC\nLIMIT\n    5;"
    },
    {
        "n": 11,
        "topic": "Revenue",
        "q": "Which menu categories generated the most revenue?",
        "note": "The same revenue idea, grouped by category instead of by item.",
        "sql": "SELECT\n    menu_items.category,\n    COUNT(order_details.item_id) AS times_ordered,\n    SUM(menu_items.price) AS total_revenue\nFROM\n    menu_items\nJOIN order_details\n    ON menu_items.menu_item_id = order_details.item_id\nGROUP BY\n    menu_items.category\nORDER BY\n    total_revenue DESC;"
    },
    {
        "n": 12,
        "topic": "Revenue",
        "q": "What are the top 10 menu items by revenue?",
        "note": "Ranks items by revenue and keeps the top 10.",
        "sql": "SELECT\n    menu_items.item_name,\n    COUNT(order_details.item_id) AS times_ordered,\n    SUM(menu_items.price) AS total_revenue\nFROM\n    menu_items\nJOIN order_details\n    ON menu_items.menu_item_id = order_details.item_id\nGROUP BY\n    menu_items.item_name,\n    menu_items.menu_item_id\nORDER BY\n    total_revenue DESC\nLIMIT 10;"
    },
    {
        "n": 13,
        "topic": "Revenue",
        "q": "What percentage of total revenue does each category contribute?",
        "note": "Uses a subquery for total revenue, so each category's revenue can be shown as a percentage.",
        "sql": "SELECT\n    menu_items.category,\n    SUM(menu_items.price) AS total_revenue,\n    ROUND(\n        SUM(menu_items.price) /\n        (SELECT SUM(menu_items.price)\n         FROM menu_items\n         JOIN order_details\n         ON menu_items.menu_item_id = order_details.item_id)\n         * 100, 2) AS revenue_percentage\nFROM\n    menu_items\nJOIN order_details\n    ON menu_items.menu_item_id = order_details.item_id\nGROUP BY\n    menu_items.category\nORDER BY\n    total_revenue DESC;"
    },
    {
        "n": 14,
        "topic": "Dates & times",
        "q": "Which date had the most orders?",
        "note": "Counts orders per date and keeps the busiest one.",
        "sql": "SELECT\n    order_date,\n    COUNT(order_date) AS total_orders\nFROM\n    order_details\nGROUP BY\n    order_date\nORDER BY\n    total_orders DESC\nLIMIT 1;"
    },
    {
        "n": 15,
        "topic": "Dates & times",
        "q": "Which date generated the most revenue?",
        "note": "Adds up revenue per date and keeps the highest.",
        "sql": "SELECT\n    order_date,\n    SUM(menu_items.price) AS total_revenue\nFROM\n    order_details\nJOIN menu_items\n    ON order_details.item_id = menu_items.menu_item_id\nGROUP BY\n    order_date\nORDER BY\n    total_revenue DESC\nLIMIT 1;"
    },
    {
        "n": 16,
        "topic": "Dates & times",
        "q": "Which hour of the day had the most orders?",
        "note": "Uses HOUR() on order_time to find the hour with the most orders.",
        "sql": "SELECT\n    HOUR(order_time) AS order_hour,\n    COUNT(order_id) AS total_orders\nFROM\n    order_details\nGROUP BY\n    order_hour\nORDER BY\n    total_orders DESC\nLIMIT 1;"
    },
    {
        "n": 17,
        "topic": "Dates & times",
        "q": "Which hour of the day generated the most revenue?",
        "note": "Finds the hour of the day that earned the most revenue.",
        "sql": "SELECT\n    HOUR(order_time) AS order_hour,\n    SUM(menu_items.price) AS total_revenue\nFROM\n    order_details\nJOIN menu_items\n    ON order_details.item_id = menu_items.menu_item_id\nGROUP BY\n    order_hour\nORDER BY\n    total_revenue DESC\nLIMIT 1;"
    },
    {
        "n": 18,
        "topic": "Dates & times",
        "q": "How does revenue vary by day?",
        "note": "Uses DAYNAME() to compare revenue across the days of the week.",
        "sql": "SELECT\n    DAYNAME(order_date) AS day_of_week,\n    SUM(menu_items.price) AS total_revenue\nFROM\n    order_details\nJOIN menu_items\n    ON order_details.item_id = menu_items.menu_item_id\nGROUP BY\n    day_of_week\nORDER BY\n    total_revenue DESC;"
    },
    {
        "n": 19,
        "topic": "Advanced",
        "q": "What are the top 3 highest-revenue items in each category?",
        "note": "Uses a CTE and ROW_NUMBER() with PARTITION BY to rank items inside each category and keep the top 3.",
        "sql": "WITH item_revenue AS (\nSELECT\n    menu_items.category,\n    menu_items.item_name,\n    SUM(menu_items.price) AS total_revenue\nFROM\n    menu_items\nJOIN order_details\n    ON menu_items.menu_item_id = order_details.item_id\nGROUP BY\n    menu_items.item_name,\n    menu_items.category\n),\nranked_items AS (\n    SELECT\n        category,\n        item_name,\n        total_revenue,\n        ROW_NUMBER() OVER (\n            PARTITION BY category\n            ORDER BY total_revenue DESC\n        ) AS revenue_rank\n    FROM item_revenue\n)\nSELECT\n    category,\n    item_name,\n    total_revenue,\n    revenue_rank\nFROM\n    ranked_items\nWHERE\n    revenue_rank <= 3\nORDER BY\n    category,\n    revenue_rank;"
    },
    {
        "n": 20,
        "topic": "Advanced",
        "q": "What is the average revenue generated per order?",
        "note": "A subquery totals each order first, then AVG() finds the average order value.",
        "sql": "SELECT\n    ROUND(AVG(order_revenue), 2) AS average_revenue_per_order\nFROM (\n    SELECT\n        order_details.order_id,\n        SUM(menu_items.price) AS order_revenue\n    FROM\n        order_details\n    JOIN menu_items\n        ON order_details.item_id = menu_items.menu_item_id\n    GROUP BY\n        order_details.order_id\n) AS order_totals;"
    }
];

const esc = s => s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const KW = /\b(SELECT|FROM|WHERE|JOIN|ON|GROUP\s+BY|ORDER\s+BY|PARTITION\s+BY|LIMIT|AS|WITH|OVER|DISTINCT|DESC|ASC|COUNT|SUM|AVG|ROUND|HOUR|DAYNAME|ROW_NUMBER)\b/gi;
const hl = s => esc(s).replace(KW, '<span class="kw">$1</span>');

// Projects page: topic tabs + list of queries
const qList = document.getElementById("q-list");
if (qList) {
    const tabs = document.getElementById("q-tabs");
    const topics = ["All", ...new Set(QUERIES.map(q => q.topic))];

    tabs.innerHTML = topics
        .map((t, i) => `<button class="tab" data-t="${t}" aria-pressed="${i === 0}">${t}</button>`)
        .join("");

    qList.innerHTML = QUERIES.map(q => `<details class="q" data-t="${q.topic}">
        <summary>Question ${q.n}: ${q.q}</summary>
        <div class="body">
            <p>${q.note}</p>
            <pre class="code"><code>${hl(q.sql)}</code></pre>
            <button class="btn ghost" data-n="${q.n}" type="button">Copy query</button>
        </div>
    </details>`).join("");

    tabs.addEventListener("click", e => {
        const b = e.target.closest(".tab");
        if (!b) return;
        tabs.querySelectorAll(".tab").forEach(x => x.setAttribute("aria-pressed", x === b));
        qList.querySelectorAll(".q").forEach(d => {
            d.hidden = b.dataset.t !== "All" && d.dataset.t !== b.dataset.t;
        });
    });

    qList.addEventListener("click", e => {
        const b = e.target.closest("button[data-n]");
        if (!b) return;
        const sql = QUERIES.find(q => q.n == b.dataset.n).sql;
        navigator.clipboard.writeText(sql).then(() => toast("Query copied"), () => toast("Copy failed"));
    });
}

// Home page: one featured query
const fq = document.getElementById("featured-query");
if (fq) {
    const q = QUERIES.find(x => x.n === 19);
    fq.innerHTML = `<p>${q.note}</p>
        <pre class="code"><code>${hl(q.sql)}</code></pre>
        <a href="projects.html#queries">See all ${QUERIES.length} queries</a>`;
}