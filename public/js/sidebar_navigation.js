/*
 * This file is part of Contao Sidebar Navigation.
 *
 * (c) Marko Cupic <m.cupic@gmx.ch>
 * @license GPL-3.0-or-later
 * For the full copyright and license information,
 * please view the LICENSE file that was distributed with this source code.
 * @link https://github.com/markocupic/contao-sidebar-navigation
 */

class ContaoSidebarNavigation {

    opt = {
        'submenuContainer': '.submenu',
        'followSubmenuContainerLink': false,
        'submenuTogglerHtml': '<button class="toggle-submenu" role="button"></button>'
    }

    constructor(options) {

        // Override defaults
        this.opt = {
            ...this.opt,
            ...options
        };

        this.initialize();
    }

    initialize() {

        // Insert dropdown toggle button
        if (this.opt.submenuTogglerHtml) {
            jQuery(this.opt.submenuTogglerHtml)
            .insertBefore('.sidebar-navigation li' + this.opt.submenuContainer + ' > a, .sidebar-navigation li' + this.opt.submenuContainer + ' > strong');
        }

        // Add aria-expanded attribute and expanded class
        jQuery('.sidebar-navigation li' + this.opt.submenuContainer + ':not(.trail)')
        .attr('aria-expanded', 'false');

        jQuery('.sidebar-navigation li' + this.opt.submenuContainer + '.trail, .sidebar-navigation li' + this.opt.submenuContainer + '.active')
        .addClass('expanded')
        .attr('aria-expanded', 'true');

        const toggler = ['.sidebar-navigation.mod_navigation .toggle-submenu'];

        if (false === this.opt.followSubmenuContainerLink) {
            toggler.push('.sidebar-navigation.mod_navigation li' + this.opt.submenuContainer + ' > a');
            toggler.push('.sidebar-navigation.mod_navigation li' + this.opt.submenuContainer + ' > strong');
        }

        /**
         * Handle click events
         */
        setTimeout(() => {
            jQuery(toggler.join(', ')).click((e) => {
                const elClicked = e.target;
                e.preventDefault();
                e.stopPropagation();

                // Close menu
                jQuery(elClicked).closest('li:not(.expanded)')
                .find('li.expanded')
                .removeClass('expanded')
                .attr('aria-expanded', 'false')
                .children('ul')
                .slideUp();

                // Close opened siblings
                jQuery(elClicked).closest('li')
                .siblings('li.expanded')
                .removeClass('expanded')
                .attr('aria-expanded', 'false')
                .children('ul')
                .slideUp();

                // Open/close item
                if (jQuery(elClicked).closest('li').hasClass('expanded')) {
                    jQuery(elClicked).closest('li')
                    .removeClass('expanded')
                    .attr('aria-expanded', 'false')
                    .children('ul')
                    .slideUp();
                } else {
                    jQuery(elClicked).closest('li')
                    .addClass('expanded')
                    .attr('aria-expanded', 'true')
                    .children('ul')
                    .slideDown();
                }
            });
        }, 50);
    }
}