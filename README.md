# Dashboard de Gestión Empresarial

## Descripción del Negocio

Dashboard es una plataforma integral de gestión empresarial diseñada para ayudar a las empresas a administrar sus relaciones con clientes, empresas asociadas, proyectos y facturación. La plataforma permite:

- **Gestión de Empresas:** Administración de compañías asociadas con información detallada de contacto y datos corporativos.
- **Gestión de Clientes:** Seguimiento de clientes, sus datos de contacto e historial.
- **Administración de Proyectos:** Creación y seguimiento de proyectos con fechas de inicio/fin, estado y descripción.
- **Facturación:** Generación y seguimiento de facturas vinculadas a clientes y proyectos.
- **Calendario de Eventos:** Organización de eventos y reuniones asociados a empresas.
- **Analítica:** Visualización de datos clave del negocio mediante gráficos y estadísticas.
- **Tareas:** Gestión de tareas y actividades pendientes.

## Tecnologías Utilizadas

### Frontend
- **Next.js 14:** Framework React de alto rendimiento con enrutamiento basado en archivos.
- **TypeScript:** Lenguaje tipado para desarrollo robusto y mantenible.
- **Tailwind CSS:** Framework de utilidades CSS para diseño responsive y moderno.
- **shadcn/ui:** Componentes de interfaz reutilizables y accesibles.
- **React Hook Form:** Manejo eficiente de formularios con validación.
- **Zod:** Validación de esquemas para TypeScript.
- **Recharts:** Biblioteca para visualización de datos y gráficos.
- **FullCalendar:** Componente avanzado para gestión de calendarios.
- **Clerk:** Servicio de autenticación y gestión de usuarios.

### Backend
- **Prisma ORM:** Mapeo objeto-relacional para interacción con base de datos.
- **PostgreSQL:** Base de datos relacional para almacenamiento persistente.
- **API Routes de Next.js:** Endpoints de API serverless para operaciones de backend.
- **Uploadthing:** Servicio para carga y gestión de archivos.

### Herramientas de Desarrollo
- **ESLint:** Análisis estático de código para identificar problemas.
- **PostCSS:** Herramienta para transformar CSS con plugins JavaScript.
- **next-themes:** Soporte para temas claro/oscuro.

## Instalación y Configuración

1. Clone el repositorio:
```bash
git clone https://github.com/tuusuario/dashboard-companies.git
cd dashboard-companies
```

2. Instale las dependencias:
```bash
npm install
```

3. Configure las variables de entorno creando un archivo `.env` con los siguientes valores:
```
DATABASE_URL="postgresql://..."
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
UPLOADTHING_SECRET=...
UPLOADTHING_APP_ID=...
```

4. Ejecute las migraciones de Prisma:
```bash
npx prisma migrate dev
```

5. Inicie el servidor de desarrollo:
```bash
npm run dev
```

6. Abra [http://localhost:3000](http://localhost:3000) en su navegador.

## Estructura del Proyecto

- `/app`: Contiene las rutas y páginas de la aplicación
- `/components`: Componentes reutilizables
- `/lib`: Utilidades y funciones de ayuda
- `/prisma`: Esquema de la base de datos y migraciones
- `/public`: Archivos estáticos
- `/utils`: Funciones de utilidad generales
