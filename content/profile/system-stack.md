---
groups:
  - name: "Frontend"
    order: 0
    items:
      - name: "Next.js"
        order: 0
      - name: "React"
        order: 1
      - name: "TypeScript"
        order: 2
      - name: "Tailwind CSS"
        order: 3
  - name: "Backend"
    order: 1
    items:
      - name: "Node.js"
        order: 0
      - name: "PostgreSQL"
        order: 1
      - name: "REST APIs"
        order: 2
  - name: "AI Apps"
    order: 2
    items:
      - name: "LLM Apps"
        order: 0
      - name: "RAG"
        order: 1
      - name: "Tool Calling"
        order: 2
      - name: "Structured Output"
        order: 3
  - name: "DevOps"
    order: 3
    items:
      - name: "Docker"
        order: 0
      - name: "Nginx"
        order: 1
      - name: "CI/CD"
        order: 2
  - name: "Content"
    order: 4
    items:
      - name: "Markdown"
        order: 0
      - name: "Admin CMS"
        order: 1
      - name: "SEO"
        order: 2
      - name: "RSS"
        order: 3
---

<!--
System stack content mapping:

- groups:
  Drives the System Stack section in the Main App.
- groups.name:
  Displayed as the module name for each stack group.
- groups.order:
  Controls group order in file mode.
- groups.items:
  Displayed as stack tags under the matching group.
- groups.items.name:
  Visible stack item text.
- groups.items.order:
  Controls item order inside the group.

Maintenance notes:
- This is neutral example stack content for the starter.
- To update the visible stack, edit groups in this file. Do not duplicate stack
  data inside components.
-->
