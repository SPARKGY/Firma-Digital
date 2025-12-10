# Firma Digital SparkGy

Este proyecto es una página web simple y elegante para capturar firmas digitales y enviarlas automáticamente por correo electrónico utilizando EmailJS.

## Configuración Requerida

Para que el envío de correos funcione, necesitas configurar **EmailJS** y agregar tus credenciales en el archivo `script.js`.

### Pasos para EmailJS:

1.  **Crear cuenta y Servicio**:
    *   Entra a [emailjs.com](https://www.emailjs.com/) y crea una cuenta gratuita.
    *   Ve a la pestaña **"Email Services"** y haz clic en "Add New Service".
    *   Selecciona **Outlook** (o tu proveedor de correo) y sigue los pasos para conectarlo.
    *   Copia el **Service ID** (ej. `service_xxxx`).

2.  **Crear Plantilla (Template)**:
    *   Ve a la pestaña **"Email Templates"** y crea una nueva.
    *   En el cuerpo del correo, asegúrate de ir a la pestaña "HTML" (icono `<>`) si quieres incrustar la imagen, o simplemente usa el editor visual.
    *   **IMPORTANTE**: Para ver la firma, debes agregar este código en el contenido de tu plantilla HTML:
        ```html
        <p>Se ha recibido una nueva firma:</p>
        <img src="{{{signature_image}}}" alt="Firma del cliente" style="width: 300px; border: 1px solid #ccc;">
        ```
        *Nota las tres llaves `{{{ }}}` para evitar que se escape el código de la imagen base64.*
    *   Guarda la plantilla y copia el **Template ID** (ej. `template_xxxx`).

3.  **Obtener Public Key**:
    *   Ve a la pestaña **"Account"** (o tu perfil).
    *   Copia tu **Public Key** (ej. `user_xxxx` o una cadena alfanumérica).

### Actualizar el Código:

1.  Abre el archivo `script.js` en esta carpeta.
2.  Busca las primeras líneas y reemplaza los valores:
    ```javascript
    const SERVICE_ID = 'service_f1fb8yb'; 
    const TEMPLATE_ID = 'template_h35fj3k';
    const PUBLIC_KEY = 'U7oI9BGaQ__4rYrt8';
    ```
3.  Guarda el archivo.

## Cómo Publicar en GitHub Pages

1.  Sube estos 3 archivos (`index.html`, `style.css`, `script.js`) a tu repositorio de GitHub.
2.  Ve a `Settings` > `Pages`.
3.  En "Source", selecciona `Deploy from a branch`.
4.  Selecciona la rama `main` (o `master`) y la carpeta `/root`.
5.  Guarda. En unos minutos tu página estará activa.
