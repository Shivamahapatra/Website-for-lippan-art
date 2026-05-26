document.addEventListener('DOMContentLoaded', () => {
    // Image Zoom Feature for Product Page
    const zoomContainers = document.querySelectorAll('.product-detail-img');

    zoomContainers.forEach(container => {
        const img = container.querySelector('img');

        container.addEventListener('mousemove', (e) => {
            const { left, top, width, height } = container.getBoundingClientRect();
            const x = (e.clientX - left) / width * 100;
            const y = (e.clientY - top) / height * 100;

            img.style.transformOrigin = `${x}% ${y}%`;
            img.style.transform = 'scale(2)';
        });

        container.addEventListener('mouseleave', () => {
            img.style.transformOrigin = 'center center';
            img.style.transform = 'scale(1)';
        });
    });

    // Auto-hide alerts after 3 seconds
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
        setTimeout(() => {
            alert.style.opacity = '0';
            setTimeout(() => alert.remove(), 300);
        }, 3000);
    });
});
