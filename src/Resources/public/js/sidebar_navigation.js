jQuery(document).ready(function () {
    var elToggler = jQuery('<button class="toggle-submenu" role="button"> </button>');
    jQuery(elToggler).insertAfter(".sidebar-navigation li.submenu > a, .sidebar-navigation li.submenu > strong");
    jQuery('.sidebar-navigation li.submenu.trail, .sidebar-navigation li.active').addClass('expanded');

    setTimeout(function () {
        jQuery('.sidebar-navigation .toggle-submenu').click(function (e) {
            e.preventDefault();
            e.stopPropagation();

            jQuery(this).closest('li').find('li.expanded').removeClass('expanded').children('ul').slideUp();
            // Close opened sibling
            jQuery(this).closest('li').siblings('li.expanded').removeClass('expanded').children('ul').slideUp();
            // open/close item
            jQuery(this).closest('li').toggleClass('expanded').children('ul').slideToggle();
        });
    }, 20);
});
