import { Layout, LayoutHeader, LayoutContent, Button } from "components";
import { useNotification } from "context";
import { useRouter } from "next/router";

export default function Users() {
  const router = useRouter();

  const goToCreate = () => router.push("/users/create");

  return (
    <Layout>
      <LayoutHeader>
        <span className="font-medium text-lg">Usuarios</span>
        <div>
          <Button
            label="Crear usuario"
            variant="primary"
            color="indigo"
            onClick={goToCreate}
          />
        </div>
      </LayoutHeader>
      <LayoutContent>Contenido...</LayoutContent>
    </Layout>
  );
}
