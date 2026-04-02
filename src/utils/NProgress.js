import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

// Konfiguratsiya faqat bir marta
NProgress.configure({
    showSpinner: false,
    minimum: 0.1,
    trickleSpeed: 200,
});

// Boshlash funksiyasi
export const start = () => {
    NProgress.start();
};

// Tugatish funksiyasi
export const done = () => {
    NProgress.done();
};
