export const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Portfolio Admin API",
    version: "1.0.0",
    description:
      "Admin API for managing all portfolio content — markdown entries, JSON data, and RAG vector entries.",
  },
  servers: [{ url: "/api", description: "Admin API" }],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http" as const,
        scheme: "bearer",
        description: "ADMIN_SECRET value as Bearer token",
      },
    },
    schemas: {
      Error: {
        type: "object" as const,
        properties: {
          error: { type: "string" as const },
        },
      },
      Ok: {
        type: "object" as const,
        properties: {
          ok: { type: "boolean" as const },
        },
      },
      ContentListItem: {
        type: "object" as const,
        properties: {
          slug: { type: "string" as const },
          title: { type: "string" as const },
          summary: { type: "string" as const },
        },
      },
      ContentEntry: {
        type: "object" as const,
        properties: {
          slug: { type: "string" as const },
          frontmatter: { type: "object" as const },
          body: { type: "string" as const },
          raw: { type: "string" as const },
        },
      },
      ContentWrite: {
        type: "object" as const,
        required: ["frontmatter", "body"],
        properties: {
          frontmatter: {
            type: "object" as const,
            description: "YAML frontmatter fields (title, summary, tags, etc.)",
          },
          body: { type: "string" as const, description: "Markdown body content" },
        },
      },
      KnowledgeListItem: {
        type: "object" as const,
        properties: {
          path: { type: "string" as const },
          category: { type: "string" as const, enum: ["professional", "labs", "meta", "general"] },
          size: { type: "integer" as const },
          modified: { type: "string" as const, format: "date-time" },
        },
      },
      KnowledgeFile: {
        type: "object" as const,
        properties: {
          path: { type: "string" as const },
          content: { type: "string" as const },
        },
      },
      Project: {
        type: "object" as const,
        properties: {
          slug: { type: "string" as const },
          title: { type: "string" as const },
          category: { type: "string" as const, enum: ["impact", "labs"] },
          tagline: { type: "string" as const },
          description: { type: "string" as const },
          story: { type: "string" as const },
          stack: { type: "array" as const, items: { type: "string" as const } },
          status: { type: "string" as const },
          links: {
            type: "array" as const,
            items: {
              type: "object" as const,
              properties: {
                label: { type: "string" as const },
                href: { type: "string" as const },
              },
            },
          },
          axiomComment: { type: "string" as const },
        },
      },
      Exhibit: {
        type: "object" as const,
        properties: {
          slug: { type: "string" as const },
          title: { type: "string" as const },
          category: { type: "string" as const, enum: ["impact", "labs", "devlog", "trivia"] },
          description: { type: "string" as const },
          axiomNote: { type: "string" as const },
          href: { type: "string" as const },
        },
      },
      RagEntry: {
        type: "object" as const,
        properties: {
          id: { type: "integer" as const },
          payload: {
            type: "object" as const,
            properties: {
              text: { type: "string" as const },
              source: { type: "string" as const },
              category: { type: "string" as const },
              timestamp: { type: "string" as const, format: "date-time" },
              tags: { type: "array" as const, items: { type: "string" as const } },
            },
          },
        },
      },
      RagCreate: {
        type: "object" as const,
        required: ["text", "source", "category"],
        properties: {
          text: { type: "string" as const },
          source: { type: "string" as const },
          category: { type: "string" as const },
        },
      },
      SeedStatus: {
        type: "object" as const,
        properties: {
          running: { type: "boolean" as const },
          progress: { type: "number" as const, description: "0-100" },
          message: { type: "string" as const },
          error: { type: "string" as const },
          startedAt: { type: "string" as const, format: "date-time" },
          completedAt: { type: "string" as const, format: "date-time" },
        },
      },
    },
  },
  security: [{ BearerAuth: [] }],
  paths: {
    // --- Health ---
    "/health": {
      get: {
        tags: ["Health"],
        summary: "Health check",
        description: "Public endpoint — no auth required. Returns service status.",
        security: [],
        responses: {
          "200": {
            description: "Service health status",
            content: { "application/json": { schema: { type: "object" as const } } },
          },
        },
      },
    },

    // --- Impact ---
    "/impact": {
      get: {
        tags: ["Impact"],
        summary: "List impact entries",
        responses: {
          "200": {
            description: "Array of impact entry summaries",
            content: {
              "application/json": {
                schema: { type: "array" as const, items: { $ref: "#/components/schemas/ContentListItem" } },
              },
            },
          },
        },
      },
    },
    "/impact/{slug}": {
      get: {
        tags: ["Impact"],
        summary: "Get impact entry",
        parameters: [{ name: "slug", in: "path", required: true, schema: { type: "string" as const } }],
        responses: {
          "200": { description: "Entry with frontmatter and body", content: { "application/json": { schema: { $ref: "#/components/schemas/ContentEntry" } } } },
          "404": { description: "Not found", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
      put: {
        tags: ["Impact"],
        summary: "Create or update impact entry",
        parameters: [{ name: "slug", in: "path", required: true, schema: { type: "string" as const } }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/ContentWrite" } } } },
        responses: {
          "200": { description: "Success", content: { "application/json": { schema: { $ref: "#/components/schemas/Ok" } } } },
        },
      },
      delete: {
        tags: ["Impact"],
        summary: "Delete impact entry",
        parameters: [{ name: "slug", in: "path", required: true, schema: { type: "string" as const } }],
        responses: {
          "200": { description: "Deleted", content: { "application/json": { schema: { $ref: "#/components/schemas/Ok" } } } },
        },
      },
    },

    // --- Labs ---
    "/labs": {
      get: {
        tags: ["Labs"],
        summary: "List labs entries",
        responses: {
          "200": {
            description: "Array of labs entry summaries",
            content: { "application/json": { schema: { type: "array" as const, items: { $ref: "#/components/schemas/ContentListItem" } } } },
          },
        },
      },
    },
    "/labs/{slug}": {
      get: {
        tags: ["Labs"],
        summary: "Get labs entry",
        parameters: [{ name: "slug", in: "path", required: true, schema: { type: "string" as const } }],
        responses: {
          "200": { description: "Entry with frontmatter and body", content: { "application/json": { schema: { $ref: "#/components/schemas/ContentEntry" } } } },
          "404": { description: "Not found" },
        },
      },
      put: {
        tags: ["Labs"],
        summary: "Create or update labs entry",
        parameters: [{ name: "slug", in: "path", required: true, schema: { type: "string" as const } }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/ContentWrite" } } } },
        responses: { "200": { description: "Success" } },
      },
      delete: {
        tags: ["Labs"],
        summary: "Delete labs entry",
        parameters: [{ name: "slug", in: "path", required: true, schema: { type: "string" as const } }],
        responses: { "200": { description: "Deleted" } },
      },
    },

    // --- Devlog ---
    "/devlog": {
      get: {
        tags: ["Devlog"],
        summary: "List devlog entries",
        responses: {
          "200": {
            description: "Array of devlog entry summaries",
            content: { "application/json": { schema: { type: "array" as const, items: { $ref: "#/components/schemas/ContentListItem" } } } },
          },
        },
      },
    },
    "/devlog/{slug}": {
      get: {
        tags: ["Devlog"],
        summary: "Get devlog entry",
        parameters: [{ name: "slug", in: "path", required: true, schema: { type: "string" as const } }],
        responses: {
          "200": { description: "Entry with frontmatter and body", content: { "application/json": { schema: { $ref: "#/components/schemas/ContentEntry" } } } },
          "404": { description: "Not found" },
        },
      },
      put: {
        tags: ["Devlog"],
        summary: "Create or update devlog entry",
        parameters: [{ name: "slug", in: "path", required: true, schema: { type: "string" as const } }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/ContentWrite" } } } },
        responses: { "200": { description: "Success" } },
      },
      delete: {
        tags: ["Devlog"],
        summary: "Delete devlog entry",
        parameters: [{ name: "slug", in: "path", required: true, schema: { type: "string" as const } }],
        responses: { "200": { description: "Deleted" } },
      },
    },

    // --- Knowledge ---
    "/knowledge": {
      get: {
        tags: ["Knowledge"],
        summary: "List all knowledge files",
        responses: {
          "200": {
            description: "Array of knowledge file metadata",
            content: { "application/json": { schema: { type: "array" as const, items: { $ref: "#/components/schemas/KnowledgeListItem" } } } },
          },
        },
      },
    },
    "/knowledge/{path}": {
      get: {
        tags: ["Knowledge"],
        summary: "Get knowledge file content",
        parameters: [{ name: "path", in: "path", required: true, schema: { type: "string" as const }, description: "File path relative to knowledge dir (e.g. professional/integration-platform)" }],
        responses: {
          "200": { description: "File content", content: { "application/json": { schema: { $ref: "#/components/schemas/KnowledgeFile" } } } },
          "404": { description: "Not found" },
        },
      },
      put: {
        tags: ["Knowledge"],
        summary: "Create or update knowledge file",
        parameters: [{ name: "path", in: "path", required: true, schema: { type: "string" as const } }],
        requestBody: { required: true, content: { "application/json": { schema: { type: "object" as const, required: ["content"], properties: { content: { type: "string" as const } } } } } },
        responses: { "200": { description: "Success" } },
      },
      delete: {
        tags: ["Knowledge"],
        summary: "Delete knowledge file",
        parameters: [{ name: "path", in: "path", required: true, schema: { type: "string" as const } }],
        responses: { "200": { description: "Deleted" } },
      },
    },

    // --- Projects ---
    "/projects": {
      get: {
        tags: ["Projects"],
        summary: "List all projects",
        responses: {
          "200": { description: "Array of projects", content: { "application/json": { schema: { type: "array" as const, items: { $ref: "#/components/schemas/Project" } } } } },
        },
      },
    },
    "/projects/{slug}": {
      get: {
        tags: ["Projects"],
        summary: "Get a project by slug",
        parameters: [{ name: "slug", in: "path", required: true, schema: { type: "string" as const } }],
        responses: {
          "200": { description: "Project", content: { "application/json": { schema: { $ref: "#/components/schemas/Project" } } } },
          "404": { description: "Not found" },
        },
      },
      put: {
        tags: ["Projects"],
        summary: "Create or update a project",
        parameters: [{ name: "slug", in: "path", required: true, schema: { type: "string" as const } }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/Project" } } } },
        responses: { "200": { description: "Success" } },
      },
      delete: {
        tags: ["Projects"],
        summary: "Delete a project",
        parameters: [{ name: "slug", in: "path", required: true, schema: { type: "string" as const } }],
        responses: { "200": { description: "Deleted" } },
      },
    },
    "/projects/reorder": {
      patch: {
        tags: ["Projects"],
        summary: "Reorder projects",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { type: "object" as const, required: ["slugs"], properties: { slugs: { type: "array" as const, items: { type: "string" as const } } } } } },
        },
        responses: { "200": { description: "Reordered" } },
      },
    },

    // --- Exhibits ---
    "/exhibits": {
      get: {
        tags: ["Exhibits"],
        summary: "List all exhibits",
        responses: {
          "200": { description: "Array of exhibits", content: { "application/json": { schema: { type: "array" as const, items: { $ref: "#/components/schemas/Exhibit" } } } } },
        },
      },
    },
    "/exhibits/{slug}": {
      get: {
        tags: ["Exhibits"],
        summary: "Get an exhibit by slug",
        parameters: [{ name: "slug", in: "path", required: true, schema: { type: "string" as const } }],
        responses: {
          "200": { description: "Exhibit", content: { "application/json": { schema: { $ref: "#/components/schemas/Exhibit" } } } },
          "404": { description: "Not found" },
        },
      },
      put: {
        tags: ["Exhibits"],
        summary: "Create or update an exhibit",
        parameters: [{ name: "slug", in: "path", required: true, schema: { type: "string" as const } }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/Exhibit" } } } },
        responses: { "200": { description: "Success" } },
      },
      delete: {
        tags: ["Exhibits"],
        summary: "Delete an exhibit",
        parameters: [{ name: "slug", in: "path", required: true, schema: { type: "string" as const } }],
        responses: { "200": { description: "Deleted" } },
      },
    },
    "/exhibits/reorder": {
      patch: {
        tags: ["Exhibits"],
        summary: "Reorder exhibits",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { type: "object" as const, required: ["slugs"], properties: { slugs: { type: "array" as const, items: { type: "string" as const } } } } } },
        },
        responses: { "200": { description: "Reordered" } },
      },
    },

    // --- Prompts ---
    "/prompts": {
      get: {
        tags: ["Prompts"],
        summary: "Get suggested prompts",
        responses: {
          "200": { description: "Array of prompt strings", content: { "application/json": { schema: { type: "array" as const, items: { type: "string" as const } } } } },
        },
      },
      put: {
        tags: ["Prompts"],
        summary: "Replace all suggested prompts",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { type: "object" as const, required: ["prompts"], properties: { prompts: { type: "array" as const, items: { type: "string" as const } } } } } },
        },
        responses: { "200": { description: "Updated" } },
      },
    },

    // --- RAG ---
    "/rag/stats": {
      get: {
        tags: ["RAG"],
        summary: "Get Qdrant collection stats",
        responses: {
          "200": { description: "Collection statistics (point count, status, etc.)", content: { "application/json": { schema: { type: "object" as const } } } },
        },
      },
    },
    "/rag/entries": {
      get: {
        tags: ["RAG"],
        summary: "List RAG entries (paginated)",
        parameters: [
          { name: "offset", in: "query", schema: { type: "integer" as const, default: 0 } },
          { name: "limit", in: "query", schema: { type: "integer" as const, default: 20, maximum: 100 } },
        ],
        responses: {
          "200": { description: "Paginated list of Qdrant points", content: { "application/json": { schema: { type: "object" as const } } } },
        },
      },
      post: {
        tags: ["RAG"],
        summary: "Add a new RAG entry",
        description: "Text is automatically embedded via Ollama before storing in Qdrant.",
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/RagCreate" } } } },
        responses: {
          "200": { description: "Created with generated ID", content: { "application/json": { schema: { type: "object" as const, properties: { ok: { type: "boolean" as const }, id: { type: "integer" as const } } } } } },
        },
      },
    },
    "/rag/entries/{id}": {
      get: {
        tags: ["RAG"],
        summary: "Get a single RAG entry",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" as const } }],
        responses: {
          "200": { description: "Qdrant point", content: { "application/json": { schema: { $ref: "#/components/schemas/RagEntry" } } } },
          "404": { description: "Not found" },
        },
      },
      put: {
        tags: ["RAG"],
        summary: "Update a RAG entry",
        description: "Text is re-embedded via Ollama on update.",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" as const } }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/RagCreate" } } } },
        responses: { "200": { description: "Updated" } },
      },
      delete: {
        tags: ["RAG"],
        summary: "Delete a RAG entry",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" as const } }],
        responses: { "200": { description: "Deleted" } },
      },
    },
    "/rag/search": {
      post: {
        tags: ["RAG"],
        summary: "Test similarity search",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { type: "object" as const, required: ["query"], properties: { query: { type: "string" as const }, limit: { type: "integer" as const, default: 5 } } } } },
        },
        responses: {
          "200": { description: "Search results with similarity scores", content: { "application/json": { schema: { type: "array" as const, items: { type: "object" as const } } } } },
        },
      },
    },
    "/rag/seed": {
      post: {
        tags: ["RAG"],
        summary: "Start RAG re-seed",
        description: "Triggers a background job that re-reads all knowledge markdown, chunks, embeds, and upserts into Qdrant. Poll /rag/seed/status for progress.",
        responses: {
          "200": { description: "Seed started" },
          "409": { description: "Seed already running" },
        },
      },
    },
    "/rag/seed/status": {
      get: {
        tags: ["RAG"],
        summary: "Get seed job status",
        responses: {
          "200": { description: "Current seed status", content: { "application/json": { schema: { $ref: "#/components/schemas/SeedStatus" } } } },
        },
      },
    },
  },
}
