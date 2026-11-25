const GH = "https://github.com/Ski1ing/sky_data_analytics_portfolio";
const WP = "https://skydataanalytics.wordpress.com/wp-content/uploads/2026/09/";

const PROJECTS = [
    {
        title: "Sales Performance Analysis",
        tool: "Excel",
        status: "Completed",
        desc: "An Excel-based analysis of sales data focused on sales trends, product performance, customer performance, and geographic performance.",
        img: "Dashboard_Preview.png",
        tags: ["Excel", "PivotTable", "PivotCharts", "Slicers", "Power Query", "Data Cleaning"],
        link: GH + "/tree/main/Sales-Performance-Analysis"
    },
    {
        title: "Employee Engagement Analysis",
        tool: "Excel",
        status: "Completed",
        desc: "An Excel analysis of employee survey responses to examine engagement levels and compare responses across different questions.",
        img: "Dashboard_Preview(Employee_Engagement_Analysis).png",
        tags: ["Excel", "PivotTable", "PivotCharts", "Slicers", "Data Cleaning", "Data Analysis"],
        link: GH + "/tree/main/Employee-Engagement-Analysis"
    },
    {
        title: "Customer Churn Analysis",
        tool: "Excel",
        status: "Completed",
        desc: "An Excel analysis of customer data to examine churn patterns and how contract type, tenure, internet service, support, and payment method relate to churn.",
        img: "Dashboard_Preview(Customer_Churn_Analysis).png",
        tags: ["Excel", "PivotTable", "Data Cleaning", "Churn Analysis", "Dashboard"],
        link: GH + "/tree/main/Customer-Churn-Analysis"
    },
    {
        title: "Restaurant Sales Analysis",
        tool: "SQL",
        status: "Completed",
        progress: 100,
        desc: "20 MySQL queries on a restaurant's order_details and menu_items tables. They cover order volume, menu items, revenue by item and category, date and time patterns, and a few advanced queries using a CTE, a window function, and subqueries.",
        tags: ["SQL", "MySQL", "Aggregation", "JOINs", "GROUP BY", "Subqueries", "CTE", "Window Functions"],
        stages: [
            ["Basic analysis", "done"],
            ["Menu analysis", "done"],
            ["Sales analysis", "done"],
            ["Date & time analysis", "done"],
            ["Advanced analysis", "done"]
        ],
        link: GH + "/blob/main/Restaurant-Sale-Analysis(SQL)/Restaurant%20Sales%20Analysis.sql",
        linkText: "View SQL file",
        more: ["Browse the queries", "#queries"]
    },
    {
        title: "Restaurant Sales Dashboard",
        tool: "Power BI",
        status: "Up next",
        desc: "A Power BI dashboard planned around the same restaurant sales data as my SQL project, with KPI cards, filters, and visuals for order volume, menu item performance, revenue, and sales patterns.",
        tags: ["Power BI", "Data Visualization"]
    }
];

const cls = s => s === "Completed" ? "done" : s === "In progress" ? "wip" : "";

function card(p, full) {
    const img = p.img
        ? `<img src="assets/img/${p.img}" alt="Dashboard preview of ${p.title}" loading="lazy" onerror="this.onerror=null;this.src='${WP}${p.img}'">`
        : "";

    const stages = full && p.stages
        ? `<div class="row"><strong>Progress</strong><span>${p.progress}%</span></div>
            <div class="meter"><b data-w="${p.progress}"></b></div>
            <ul class="stages">${p.stages.map(([n, s]) => `<li class="${s}"><span class="dot">${s === "done" ? "✓" : ""}</span>${n}${s === "wip" ? " (working on it)" : s === "" ? " (next)" : ""}</li>`).join("")}</ul>`
        : "";

    const link = p.link
        ? `<a href="${p.link}" target="_blank" rel="noopener">${p.linkText || "View on GitHub"}</a>`
        : "";

    const more = full && p.more
        ? `<a href="${p.more[1]}" style="margin-left:16px">${p.more[0]}</a>`
        : "";

    return `<article class="card" data-tool="${p.tool}">
        <div class="row"><h3>${p.title}</h3><span class="badge ${cls(p.status)}">${p.status}</span></div>
        <p>${p.desc}</p>${img}
        <ul class="tags">${p.tags.map(t => `<li>${t}</li>`).join("")}</ul>${stages}${link}${more}</article>`;
}

// Projects page: all cards + filter chips
const list = document.getElementById("project-list");
if (list) {
    list.innerHTML = PROJECTS.map(p => card(p, true)).join("");

    document.querySelectorAll(".chip").forEach(c => c.addEventListener("click", () => {
        document.querySelectorAll(".chip").forEach(x => x.setAttribute("aria-pressed", x === c));
        list.querySelectorAll(".card").forEach(el => {
            el.hidden = c.dataset.f !== "All" && el.dataset.tool !== c.dataset.f;
        });
    }));
}

// Home page: Excel project preview
const prev = document.getElementById("project-preview");
if (prev) {
    prev.innerHTML = PROJECTS.filter(p => p.tool === "Excel").map(p => card(p, false)).join("");
}

// Progress bar animation
setTimeout(() => {
    document.querySelectorAll(".meter b").forEach(b => b.style.width = b.dataset.w + "%");
}, 200);

// Hero: typed SQL query
const q = document.getElementById("typed");
if (q) {
    const text = "SELECT name, year_level, focus, tools\nFROM student\nWHERE name = 'Felix E Van Sky Esteban';";
    const colour = s => s
        .replace(/\b(SELECT|FROM|WHERE)\b/g, '<span class="kw">$1</span>')
        .replace(/'[^']*'/g, '<span class="str">$&</span>');
    const show = () => document.getElementById("result").hidden = false;

    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
        q.innerHTML = colour(text);
        show();
    } else {
        let i = 0;
        const t = setInterval(() => {
            q.innerHTML = colour(text.slice(0, ++i));
            if (i >= text.length) {
                clearInterval(t);
                setTimeout(show, 350);
            }
        }, 35);
    }
}

// Theme toggle
const root = document.documentElement;
const tb = document.getElementById("theme");
const setTheme = m => {
    root.dataset.theme = m;
    tb.textContent = m === "dark" ? "Light mode" : "Dark mode";
    tb.setAttribute("aria-pressed", m === "dark");
};

let saved = null;
try { saved = localStorage.getItem("theme"); } catch (e) {}
setTheme(saved || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));

tb.addEventListener("click", () => {
    const m = root.dataset.theme === "dark" ? "light" : "dark";
    setTheme(m);
    try { localStorage.setItem("theme", m); } catch (e) {}
});

// Mobile menu (hamburger)
const mb = document.getElementById("menu-btn");
const nav = document.getElementById("nav");
if (mb && nav) {
    const setMenu = open => {
        nav.classList.toggle("open", open);
        mb.setAttribute("aria-expanded", open);
        mb.textContent = open ? "✕" : "☰";
    };

    mb.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
    nav.addEventListener("click", e => { if (e.target.closest("a")) setMenu(false); });
    addEventListener("keydown", e => { if (e.key === "Escape") setMenu(false); });
    matchMedia("(min-width: 701px)").addEventListener("change", () => setMenu(false));
}

// Contact form: opens the visitor's email app; copy-email button
const EMAIL = "felix.vansky.esteban@gmail.com";

const toast = msg => {
    const t = document.getElementById("toast");
    t.textContent = msg;
    t.classList.add("show");
    setTimeout(() => t.classList.remove("show"), 2000);
};

const f = document.getElementById("contact-form");
if (f) {
    f.addEventListener("submit", e => {
        e.preventDefault();
        const d = new FormData(f);
        const subject = encodeURIComponent("Portfolio message from " + d.get("name"));
        const body = encodeURIComponent(d.get("message"));
        location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
    });
}

const cp = document.getElementById("copy-email");
if (cp) {
    cp.addEventListener("click", () => {
        navigator.clipboard.writeText(EMAIL).then(() => toast("Email copied"), () => toast(EMAIL));
    });
}

document.querySelectorAll(".year").forEach(y => y.textContent = new Date().getFullYear());
