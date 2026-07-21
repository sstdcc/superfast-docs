---
id: reports
title: Reports
sidebar_label: Reports
sidebar_position: 6
---

# Reports

The Reports screen provides visual analytics and financial summaries to help you understand your store's financial health over time. It is divided into three tabs.

## Accessing Reports

Tap **Reports** in the bottom navigation bar (or the chart icon on the Dashboard quick links grid).

---

## Tab 1 — Cash Flow

The **Cash Flow** tab shows your money in vs. money out over a selected time period.

### Chart: Revenue vs Expenses Bar Chart

A grouped bar chart with:
- **Blue bars** — money received (customer payments)
- **Red bars** — money paid out (supplier payments)
- **X-axis** — time periods (daily, weekly, or monthly; toggle with the period selector)
- **Y-axis** — amount in your store currency

### Date Range Selector

Choose from:
- Last 7 days
- Last 30 days
- Last 3 months
- Last 12 months
- Custom date range (date pickers)

### Summary Row

Below the chart:
| Metric | Value |
|---|---|
| Total Received | Sum of all customer payments in range |
| Total Paid Out | Sum of all supplier payments in range |
| Net Cash Flow | Total Received − Total Paid Out |

:::tip
A positive net cash flow means more money came in than went out. Monitor this weekly to stay ahead of cash crunches.
:::

---

## Tab 2 — Balances

The **Balances** tab shows a ranked list of who owes the most (customers) and who you owe the most (suppliers).

### Customer Balances List

Sorted highest-to-lowest. Each row shows:
- Rank number
- Customer name
- Balance amount
- Progress bar (relative to the highest balance)

### Supplier Balances List

Sorted highest-to-lowest (amount you owe). Same layout as customer list.

### Totals

At the bottom:
- **Total Customer Debt**: Sum of all customer balances
- **Total Supplier Debt**: Sum of all supplier balances
- **Net Position**: Customer Debt − Supplier Debt

---

## Tab 3 — Analytics

The **Analytics** tab provides deeper insights with multiple chart types powered by Recharts.

### Pie Chart — Debt Distribution

Shows the percentage breakdown of total customer debt by top 10 customers. Helps identify concentration risk (e.g. one customer holding 60% of your total debt).

### Area Chart — Balance Trends

A stacked area chart showing how **total customer debt** and **total supplier debt** have changed over time. This lets you see:
- Is your customer debt growing? (Are people buying more on credit?)
- Is your supplier debt growing? (Are you buying more stock on credit?)

### Line Chart — Transaction Volume

Number of transactions per day/week/month. Useful for spotting:
- High-volume days (market days, weekends)
- Periods of inactivity

### Top Customers Table

A table of your top 10 customers by:
- Total debt amount
- Number of transactions
- Last transaction date

### Top Suppliers Table

Same as top customers but for suppliers.

---

## Exporting Reports

On desktop, each chart has an **Export** button (download icon) in the top-right corner:
- **PNG** — exports the chart as an image
- **CSV** — exports the underlying data as a spreadsheet

:::note
Export to CSV requires the app to be in desktop mode. On Android, screenshots can be used to capture charts.
:::

---

## Performance Note

All reports are generated from the **local SQLite database** using aggregation queries. No network request is made to load report data. Queries typically run in under 50 ms even with thousands of transactions.

If you notice the reports tab flickering or refreshing repeatedly, ensure you are on the latest app version — an earlier bug caused unnecessary re-renders on the Analytics tab which has since been fixed.
