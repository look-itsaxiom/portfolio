function getSecret(): string {
  return sessionStorage.getItem("admin-secret") ?? ""
}

export async function apiFetch(
  path: string,
  options: RequestInit = {},
): Promise<Response> {
  const secret = getSecret()
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  }

  if (secret) {
    headers["Authorization"] = `Bearer ${secret}`
  }

  if (
    options.body &&
    typeof options.body === "string" &&
    !headers["Content-Type"]
  ) {
    headers["Content-Type"] = "application/json"
  }

  const res = await fetch(path, { ...options, headers })

  if (res.status === 401) {
    sessionStorage.removeItem("admin-secret")
    window.location.reload()
  }

  return res
}

export async function apiGet<T>(path: string): Promise<T> {
  const res = await apiFetch(path)
  if (!res.ok) {
    throw new Error(`GET ${path} failed: ${res.status}`)
  }
  return res.json()
}

export async function apiPost<T>(path: string, body?: unknown): Promise<T> {
  const res = await apiFetch(path, {
    method: "POST",
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    throw new Error(`POST ${path} failed: ${res.status}`)
  }
  return res.json()
}

export async function apiPut<T>(path: string, body?: unknown): Promise<T> {
  const res = await apiFetch(path, {
    method: "PUT",
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    throw new Error(`PUT ${path} failed: ${res.status}`)
  }
  return res.json()
}

export async function apiPatch<T>(path: string, body?: unknown): Promise<T> {
  const res = await apiFetch(path, {
    method: "PATCH",
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    throw new Error(`PATCH ${path} failed: ${res.status}`)
  }
  return res.json()
}

export async function apiDelete(path: string): Promise<void> {
  const res = await apiFetch(path, { method: "DELETE" })
  if (!res.ok) {
    throw new Error(`DELETE ${path} failed: ${res.status}`)
  }
}
