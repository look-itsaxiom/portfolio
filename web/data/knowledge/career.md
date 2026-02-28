# Chase's Career History

## Overview
Chase's career follows an unconventional arc: IT helpdesk to sysadmin to software engineer, driven by a pattern of automating everything in their environment until someone noticed they should be building software full-time.

## HD Fowler — IT Support (Oct 2017 - Jun 2018)
- Location: Washington state
- Role: IT support and ERP administration
- First professional exposure to scripting and automation
- Managed internal systems and provided technical support

## Groupon — IT Helpdesk (Jun 2018 - Mar 2020)
- Location: Seattle area
- Role: Helpdesk support
- Built Zendesk automation workflows and inventory management scripts
- Became known internally as "the scripting guy" for automating repetitive support tasks
- This is where the pattern started: Chase automated their own job to the point where people noticed

## Limeade — IT / Sysadmin (Mar 2020 - Jan 2022)
- Location: Bellevue, WA (remote during COVID)
- Role: De facto sysadmin, officially IT
- Key work:
  - PowerShell automation across Windows and macOS environments
  - Laptop inventory management and provisioning systems
  - Automated password reset systems via email
  - Zendesk auto-response automation
  - Windows AutoPilot deployment for device provisioning
  - Jamf macOS deployment and management
  - Azure Functions for high-frequency event processing
  - Hybrid Azure AD administration
  - Intune MDM management
- This role bridged IT and engineering. Chase was writing real software in PowerShell and Azure Functions, even though their title was IT.

## The Pivot (2021-2022)
The Director of Engineering at Limeade noticed Chase's scripting and automation work and asked if they'd ever considered software engineering. Chase had previously attempted CS coursework in community college around 2014-2015 and dropped it. But with a newborn in 2021, they used FMLA paternity leave to study JavaScript, Ruby, and Python. When they returned, they transitioned into the engineering department.

## Limeade — Software Engineer (Jan 2022 - Sept 2024)
- Location: Bellevue, WA (later acquired by WebMD)
- Role: Started as Junior Engineer, promoted to Associate Engineer within 6-8 months
- Team: Activities team — .NET microservices + React admin portal for employer wellness activity configuration
- Key achievements:
  - **Greenfield admin rebuild**: Led replacement of legacy .NET/Knockout.js/jQuery admin portal with React. Trusted with ownership of the project.
  - **Strangler pattern migration**: Broke features out of a monolith into 2 microservices ("trinity" architecture). Achieved 75-115% load time improvement.
  - **Azure Durable Function**: Built event-driven orchestration to decouple high-frequency activity tracking from the main service.
  - **PrimeReact design system**: Ran a cross-functional campaign across engineering and UX design to adopt a shared component library. Addressed the problem of designers handing over Figma designs that assumed impossible frontend changes. Gained significant adoption before the WebMD acquisition.
  - **Accessibility**: WCAG AA compliance work on the user-facing product.
  - **Developer onboarding**: Automated dev environment setup (one-touch), wrote comprehensive onboarding documentation.
- Promotion rationale: Contributing at a mid-level pace as a junior, consistently delivering beyond the expected scope of the role.

## Tapcheck — Software Engineer (Sept 2024 - Present)
- Location: Remote (company based in CA)
- Role: Software Engineer, Integrations team
- Company: Earned wage access platform — partners with employers so employees can access earned wages before payday, providing an alternative to predatory payday loans.
- Team: Chase + tech lead + 2 offshore engineers + 2 offshore QA. Tech lead handles PM and cross-team coordination; Chase designs and implements technical solutions.
- Key achievements:
  - **No Code Platform** (Chase's primary creation):
    - v1: CSV header mapping UI — internal admins can map payroll CSV exports to Tapcheck's common data model without engineering involvement. Eliminated 2-week SDLC dependency for onboarding new partners.
    - v2: Configurable transformations — string manipulation and data massaging for non-1:1 mappings. Caught more edge cases.
    - v3: No Code API — Azure Logic Apps layer for API-based integrations. Converts API responses to CSV format consumable by the No Code system.
  - **Multi-tenant integration system**: The platform connects to 250+ payroll and timeclock systems (ADP, Workday, Dayforce, Viventium Express, and others).
  - **DevOps improvements**: Introduced Git Flow, split CI/CD into pre/post-merge pipelines, building ephemeral QA environments. No dedicated DevOps support on the team.
  - **AI knowledge chatbot**: Building an internal chatbot for organizational and domain knowledge, deployed in Microsoft Teams where people already work. Addresses tribal knowledge loss and domain knowledge drift.

## The Pattern
Across every role, Chase's approach has been consistent: identify repetitive friction, automate it away, and build systems that scale without linear effort. This pattern took them from IT helpdesk scripts to a No Code platform serving 250+ integrations. The tools change, the instinct doesn't.
