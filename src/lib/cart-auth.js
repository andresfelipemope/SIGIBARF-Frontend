export function requireCartAuth(router, toast) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access") : null;

  if (!token) {
    toast.error("Debes iniciar sesión para acceder al carrito.");
    router.push("/auth/login");
    return false;
  }

  return true;
}
