// EmailJS Configuration
// -----------------------------------------------------
// REPLACE THESE VALUES WITH YOUR ACTUAL KEYS FROM EMAILJS
const SERVICE_ID = 'YOUR_SERVICE_ID'; 
const TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
const PUBLIC_KEY = 'YOUR_PUBLIC_KEY';
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

    // Send Button
    sendBtn.addEventListener('click', () => {
        if (!hasSigned) {
            showMessage('Por favor, firme antes de enviar.', 'error');
            return;
        }

        if (SERVICE_ID === 'YOUR_SERVICE_ID' || PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
             showMessage('Error: Configuración de EmailJS incompleta. Revise el código.', 'error');
             alert('ATENCIÓN: Debe configurar sus claves de EmailJS en el archivo script.js para que esto funcione.');
             return;
        }

        // Show loading state
        sendBtn.disabled = true;
        sendBtn.innerHTML = 'Enviando...';

        // Convert canvas signature to data URL (image)
        // Note: EmailJS templates usually need a hidden field to accept the huge base64 string, 
        // or usage of an attachment if supported by the tier.
        // A simpler way for text-only templates is sending the link, but base64 is too long for URL params often.
        // We will send it as a parameter 'message' or 'signature_image' assuming the template has {{{signature_image}}}.
        
        const signatureData = canvas.toDataURL('image/png');

        const templateParams = {
            to_email: 'sistematizacion@sparkgy.com',
            subject: 'Nueva Firma Recibida',
            message: 'Se ha recibido una nueva firma digital.',
            signature_image: signatureData // This requires the template to have <img src="{{{signature_image}}}" />
        };

        emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams)
            .then(function(response) {
                console.log('SUCCESS!', response.status, response.text);
                showMessage('¡Firma enviada correctamente!', 'success');
                sendBtn.disabled = false;
                sendBtn.innerHTML = `
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                    </svg>
                    Enviar Firma
                `;
                // Optional: clear after send
                // ctx.clearRect(0, 0, canvas.width, canvas.height); 
            }, function(error) {
                console.log('FAILED...', error);
                showMessage('Error al enviar. Intente nuevamente.', 'error');
                sendBtn.disabled = false;
                sendBtn.innerHTML = `
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                    </svg>
                    Enviar Firma
                `;
            });
    });

    function showMessage(text, type) {
        statusMessage.textContent = text;
        statusMessage.className = `status-message ${type}`;
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            statusMessage.className = 'status-message';
        }, 5000);
    }
});
