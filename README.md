# Firma Digital SparkGy

Este proyecto es una página web simple y elegante para capturar firmas digitales, **incluyendo detalles del pedido y ubicación**, y enviarlas automáticamente por correo electrónico.

## Características Nuevas
*   **Lectura de Datos**: Captura `id`, `solicitud`, `description` y `quantity` desde el enlace.
*   **Geolocalización**: Captura automáticamente las coordenadas GPS al enviar.
*   **Timestamp**: Registra la fecha y hora exacta de la firma.

## Cómo Usar (Formato del Link)

Para pre-cargar los datos, debes enviar el link al cliente con los parámetros al final:

`https://sparkgy.github.io/Firma-Digital/index.html?id=123&solicitud=REQ-001&description=Cableado&quantity=10`

*   **id**: Identificador único.
*   **solicitud**: Número de solicitud/orden.
*   **description**: Descripción breve del item.
*   **quantity**: Cantidad.

Si no se envían parámetros, la página funcionará pero mostrará campos vacíos en el detalle.

## Configuración Requerida

### Pasos para EmailJS:

1.  Actualiza tu **Service ID**, **Template ID** y **Public Key** en `script.js` si aún no lo has hecho.
2.  **IMPORTANTE**: Debes actualizar tu plantilla en EmailJS para recibir los nuevos datos.

#### Nuevo código para la Plantilla de EmailJS:

Copia y pega esto en el código HTML de tu plantilla:

```html
<div style="font-family: Arial, sans-serif; color: #333; max-width: 600px;">
    <h2 style="color: #0066CC;">Nueva Firma Recibida</h2>
    
    <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
        <p><strong>Solicitud #:</strong> {{solicitud}}</p>
        <p><strong>ID:</strong> {{id}}</p>
        <p><strong>Descripción:</strong> {{description}}</p>
        <p><strong>Cantidad:</strong> {{quantity}}</p>
        <p><strong>Fecha/Hora:</strong> {{timestamp}}</p>
        <p><strong>Ubicación:</strong> <a href="{{location}}" target="_blank">{{location}}</a></p>
    </div>

    <div style="margin: 20px 0; padding: 15px; border: 2px dashed #e0e0e0; border-radius: 8px; background-color: #fff;">
        <p style="margin-top: 0; font-size: 14px; color: #666;">Firma capturada:</p>
        <img src="{{{signature_image}}}" alt="Firma del Cliente" style="max-width: 100%; height: auto; border: 1px solid #ccc; background: #fff;" />
    </div>

    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
    <p style="font-size: 12px; color: #999;">
        Recibido desde la web de Firma Digital SparkGy
    </p>
</div>
```

## Cómo Publicar en GitHub Pages

1.  Haz Push de los cambios a GitHub.
2.  Espera 1-2 minutos para que se actualice automáticamente.
