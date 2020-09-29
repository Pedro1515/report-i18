import React from "react";
import {
  Layout,
  LayoutHeader,
  LayoutContent,
  Select,
  FormControl,
  FormSection,
  FormInput,
} from "components";

export default function Create() {
  return (
    <Layout>
      <LayoutHeader>
        <span className="font-medium text-lg">Crear usuario</span>
      </LayoutHeader>
      <LayoutContent>
        <div className="p-6">
          <FormSection title="Perfil" subtitle="Datos personales del usuario">
            <FormControl
              label="Username"
              component={
                <FormInput
                  id="Nombre de usuario"
                  type="text"
                  placeholder="Ingrese nombre de usuario"
                />
              }
            />
            <FormControl
              label="Nombre"
              component={
                <FormInput
                  id="username"
                  type="text"
                  placeholder="Ingrese nombre"
                />
              }
            />
            <FormControl
              label="Apellido"
              component={
                <FormInput
                  id="username"
                  type="text"
                  placeholder="Ingrese apellido"
                />
              }
            />
            <FormControl
              label="Nacionalidad"
              component={
                <Select
                  name="since"
                  options={[
                    { label: "Argentina", value: "ar" },
                    { label: "Brasil", value: "br" },
                  ]}
                  selected={{ label: "Argentina", value: "ar" }}
                  onSelect={(e) => console.log(e)}
                />
              }
            />
          </FormSection>
        </div>
      </LayoutContent>
    </Layout>
  );
}
