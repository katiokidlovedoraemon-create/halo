document.addEventListener('DOMContentLoaded', () => {
    const bedPreview = document.getElementById('bed-preview');
    const priceText = document.getElementById('total-price-display');
    const colorBtns = document.querySelectorAll('.color-btn');
    const patternBtns = document.querySelectorAll('.pattern-btn');
    
    let currentColor = 'black';
    let currentPattern = 'none';

    const imageMap = {
        'black':  { 'none': '100.jpg', 'star': '115.jpg', 'flower': '113.jpg', 'both': '114.jpg' }, 
        'yellow': { 'none': '101.jpg', 'star': '102.jpg' },
        'blue':   { 'none': '104.jpg', 'star': '103.jpg' },
        'red':    { 'none': '106.jpg', 'star': '105.png' },
        'green':  { 'none': '108.jpg', 'star': '107.jpg' },
        'pink':   { 'none': '110.jpg', 'star': '109.jpg' },
        'purple': { 'none': '112.jpg', 'star': '111.jpg' }
    };

    function updateUI() {
        const btnFlower = document.querySelector('[data-pattern="flower"]');
        const btnBoth = document.querySelector('[data-pattern="both"]');

        if (currentColor !== 'black') {
            btnFlower.disabled = true;
            btnBoth.disabled = true;
            if (currentPattern === 'flower' || currentPattern === 'both') {
                currentPattern = 'none';
                patternBtns.forEach(b => b.classList.remove('active'));
                document.querySelector('[data-pattern="none"]').classList.add('active');
            }
        } else {
            btnFlower.disabled = false;
            btnBoth.disabled = false;
        }

        let price = (currentColor === 'black') ? 1000 : 1100;
        if (currentPattern === 'star') price += 200;
        if (currentPattern === 'flower') price += 250;
        if (currentPattern === 'both') price += 400;

        bedPreview.src = imageMap[currentColor][currentPattern] || '100.jpg';
        priceText.innerText = `Tổng: ${price} USD`;
    }

    colorBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            colorBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentColor = btn.dataset.color;
            updateUI();
        });
    });

    patternBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.disabled) return;
            patternBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentPattern = btn.dataset.pattern;
            updateUI();
        });
    });

    if (window.paypal) {
        paypal.Buttons({
            style: { layout: 'vertical', color: 'blue', shape: 'rect' },
            createOrder: (data, actions) => {
                const total = priceText.innerText.replace(/[^0-9]/g, '');
                return actions.order.create({
                    purchase_units: [{ amount: { value: total } }]
                });
            }
        }).render('#paypal-button-container');
    }

    updateUI();
});