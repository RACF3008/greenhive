import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";

const Redirect = () => {
  const cookieStore = cookies();
  const token = cookieStore.get("session")?.value;

  // Reemplaza 'your_jwt_secret' por tu clave real
  try {
    const payload = jwt.verify(token || "", process.env.JWT_KEY!); // Verifica firma y expiración
    redirect("/dashboard"); // JWT válido → redirige al dashboard (o donde quieras)
  } catch (err) {
    redirect("/signin?err=Signin required"); // JWT inválido o no presente → redirige a login
  }

  return <div>Redirecting...</div>;
};

export default Redirect;
