// EmailJS Configuration
// -----------------------------------------------------
// REPLACE THESE VALUES WITH YOUR ACTUAL KEYS FROM EMAILJS
const SERVICE_ID = 'service_f1fb8yb';
const TEMPLATE_ID = 'template_h35fj3k';
const PUBLIC_KEY = 'U7oI9BGaQ__4rYrt8';
// -----------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    // Initialize EmailJS
    emailjs.init(PUBLIC_KEY);

    const canvas = document.getElementById('signature-pad');
    const ctx = canvas.getContext('2d');
    const clearBtn = document.getElementById('clear-btn');
    const sendBtn = document.getElementById('send-btn');
    const placeholderText = document.querySelector('.placeholder-text');
    const statusMessage = document.getElementById('status-message');

    // New: Details Elements
    const detailsContainer = document.getElementById('details-container');
    const detailId = document.getElementById('detail-id');
    const detailSolicitud = document.getElementById('detail-solicitud');
    const detailDesc = document.getElementById('detail-descripcion');
    const detailQty = document.getElementById('detail-cantidad');

    // 1. Parse URL Parameters on Load
    const urlParams = new URLSearchParams(window.location.search);
    const paramId = urlParams.get('id');
    const paramSolicitud = urlParams.get('solicitud'); // or 'numero_solicitud'
    const paramDesc = urlParams.get('description');
    const paramQty = urlParams.get('quantity');

    // If params exist, show them
    if (paramId || paramSolicitud || paramDesc || paramQty) {
        detailsContainer.style.display = 'block';
        if (paramId) detailId.textContent = paramId;
        if (paramSolicitud) detailSolicitud.textContent = paramSolicitud;
        if (paramDesc) detailDesc.textContent = paramDesc;
        if (paramQty) detailQty.textContent = paramQty;
    }

    let isDrawing = false;
    let hasSigned = false;

    // Set canvas size
    function resizeCanvas() {
        const ratio = Math.max(window.devicePixelRatio || 1, 1);
        canvas.width = canvas.offsetWidth * ratio;
        canvas.height = canvas.offsetHeight * ratio;
        ctx.scale(ratio, ratio);
    }

    // Initial resize
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Drawing functions
    function startPosition(e) {
        isDrawing = true;
        hasSigned = true;
        placeholderText.style.display = 'none'; // Hide placeholder on first touch
        draw(e);
    }

    function endPosition() {
        isDrawing = false;
        ctx.beginPath();
    }

    function draw(e) {
        if (!isDrawing) return;

        // Get correct coordinates for mouse and touch
        let clientX, clientY;
        if (e.type.includes('touch')) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        const rect = canvas.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#000';

        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
    }

    // Event Listeners
    canvas.addEventListener('mousedown', startPosition);
    canvas.addEventListener('mouseup', endPosition);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseleave', endPosition); // Stop drawing if mouse leaves canvas

    // Touch support (mobile)
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault(); // Prevent scrolling
        startPosition(e);
    });
    canvas.addEventListener('touchend', endPosition);
    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault(); // Prevent scrolling
        draw(e);
    });

    // Clear Button
    clearBtn.addEventListener('click', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Use actual width/height
        placeholderText.style.display = 'block';
        hasSigned = false;
        statusMessage.className = 'status-message';
        statusMessage.textContent = '';
    });

    // Send Button Logic
    sendBtn.addEventListener('click', () => {
        if (!hasSigned) {
            showMessage('Por favor, firme antes de enviar.', 'error');
            return;
        }

        if (SERVICE_ID === 'YOUR_SERVICE_ID' || PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
            showMessage('Error: Configuración de EmailJS incompleta.', 'error');
            return;
        }

        // Disable button immediately
        sendBtn.disabled = true;
        sendBtn.innerHTML = 'Obteniendo ubicación...';

        // 2. Get Geolocation and Timestamp
        if (!navigator.geolocation) {
            // Geolocation not supported
            sendEmail("Ubicación no soportada por el navegador");
        } else {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const long = position.coords.longitude;
                    const locationString = `Lat: ${lat}, Long: ${long} (Google Maps: https://maps.google.com/?q=${lat},${long})`;
                    sendEmail(locationString);
                },
                (error) => {
                    console.warn("Geolocation error:", error);
                    let errorMsg = "Ubicación no disponible (Permiso denegado o error)";
                    sendEmail(errorMsg);
                },
                { timeout: 10000, maximumAge: 0 } // wait max 10s
            );
        }
    });

    function sendEmail(locationInfo) {
        sendBtn.innerHTML = 'Enviando...';

        const signatureData = canvas.toDataURL('image/png');
        const timestamp = new Date().toLocaleString('es-ES'); // Localized timestamp

        const templateParams = {
            to_email: 'sistematizacion@sparkgy.com',
            subject: `Nueva Firma: Solicitud ${paramSolicitud || '-'}`,
            message: 'Se ha recibido una nueva firma digital.',
            signature_image: signatureData,
            // New Fields
            id: paramId || 'N/A',
            solicitud: paramSolicitud || 'N/A',
            description: paramDesc || 'N/A',
            quantity: paramQty || 'N/A',
            timestamp: timestamp,
            location: locationInfo
        };

        emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams)
            .then(function (response) {
                console.log('SUCCESS!', response.status, response.text);
                showMessage('¡Firma y datos enviados correctamente!', 'success');
                sendBtn.disabled = false;
                sendBtn.innerHTML = `
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                    </svg>
                    Enviar Firma
                `;
            }, function (error) {
                console.log('FAILED...', error);
                showMessage('Error al enviar. Intente más tarde.', 'error');
                sendBtn.disabled = false;
                sendBtn.innerHTML = `
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                    </svg>
                    Enviar Firma
                `;
            });
    }

    function showMessage(text, type) {
        statusMessage.textContent = text;
        statusMessage.className = `status-message ${type}`;
        setTimeout(() => {
            statusMessage.className = 'status-message';
        }, 5000);
    }
});
