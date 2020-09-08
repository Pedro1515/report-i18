import { Layout, Button } from "components";
import { useNotification } from "context";

export default function Users() {
  const { show } = useNotification();
  return (
    <Layout>
      <div className="w-1/6">
        <Button
          variant="primary"
          color="red"
          label="Press me"
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
    </Layout>
  );
}
