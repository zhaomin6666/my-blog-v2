---
groups:
  - name: "Backend"
    order: 0
    items:
      - name: "Java"
        order: 0
      - name: "Spring Boot"
        order: 1
      - name: "MyBatis"
        order: 2
      - name: "Redis"
        order: 3
      - name: "REST APIs"
        order: 4
      - name: "Relational Databases"
        order: 5
  - name: "Frontend / Full-stack"
    order: 1
    items:
      - name: "TypeScript"
        order: 0
      - name: "React"
        order: 1
      - name: "Next.js"
        order: 2
      - name: "Tailwind CSS"
        order: 3
  - name: "AI Agent"
    order: 2
    items:
      - name: "LangChain.js"
        order: 0
      - name: "LangGraph.js"
        order: 1
      - name: "Structured Output"
        order: 2
      - name: "Tool Calling"
        order: 3
      - name: "RAG"
        order: 4
      - name: "Agent Workflow"
        order: 5
  - name: "DevOps / Deployment"
    order: 3
    items:
      - name: "Docker"
        order: 0
      - name: "Docker Compose"
        order: 1
      - name: "Nginx"
        order: 2
      - name: "Linux"
        order: 3
      - name: "HTTPS / Let's Encrypt"
        order: 4
  - name: "Learning / Exploring"
    order: 4
    items:
      - name: "MCP"
        order: 0
      - name: "OAuth"
        order: 1
      - name: "Agent Persistence"
        order: 2
      - name: "Enterprise Knowledge Base"
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
- Learning / Exploring means the area is being studied or explored. It should not
  be presented as mature production expertise.
- To update the visible stack, edit groups in this file. Do not duplicate stack
  data inside components.
-->
