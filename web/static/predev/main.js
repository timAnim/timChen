require.config({
    baseUrl: './src/',
});
require(['Scroller', 'Hammer'], function(Scroller, Hammer) {
    require(['predev'], function(predev) {
        require(['Presenter'], function(Presenter) {
            window.pd = predev;
            window.Scroller = Scroller;
            window.Presenter = Presenter;
            window.Hammer = Hammer;
            require.init();
        });
    });
});