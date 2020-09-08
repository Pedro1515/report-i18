import { Layout, LayoutHeader, LayoutContent, Button } from "components";
import { useNotification } from "context";

export default function Users() {
  const { show } = useNotification();
  return (
    <Layout>
      <LayoutHeader>
        {" "}
        <span className="font-medium text-lg">Usuarios</span>
        <div>
          <Button
            label="Crear usuario"
            variant="primary"
            color="indigo"
            onClick={() =>
              show({
                title: "Exito!",
                message:
                  "Se eliminaron correctamente los usuarios seleccionados.",
                type: "success",
              })
            }
          />
        </div>
      </LayoutHeader>
      <LayoutContent>Contenido...</LayoutContent>
    </Layout>
  );
}
