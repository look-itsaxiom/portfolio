# No-Code Integration Platform

## The Problem
Partner data arrived in every shape imaginable. Onboarding new integrations required scheduling entire sprints for one-off data mappings — a bottleneck that slowed partner activation.

## The Solution
Chase led a small team building a **full-stack** no-code capability inside the back-of-house admin app. Instead of writing custom code for each partner, admins could define schemas and transformations through a visual UI.

## Technical Approach
- **Stack:** Angular, TypeScript, .NET, SQL Server, Azure Logic Apps
- **Architecture:** Modular backend with pluggable data source adapters
- **Frontend:** Admin UI for schema definition, field mapping, and transformation rules
- Started with **file-based timeclock** integrations
- Expanded to **file-based payroll** integrations
- Grew a richer transformation system so more integrations could be delivered via no-code
- Shipped the **No Code API** to enable **API-based** timeclock and payroll integrations (powered by Azure Logic Apps)

## Impact
- Onboarding went from "schedule a sprint" to "ship it this week"
- Reduced partner activation time from weeks to days
- Enabled non-engineering team members to configure integrations independently

## What Makes This Interesting
This wasn't just a CRUD tool — it was a platform shift. The no-code approach meant the engineering team could focus on building features instead of mapping data for each new partner. The system scaled with the business without requiring linear engineering effort.
