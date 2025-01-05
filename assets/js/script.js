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
        'submenuContainerClass': '.submenu',
        'pageContainerClass': '.page-container', // Not-clickable links
        'followPageContainerLinks': false, // Follow not-clickable links
        'dropdownTogglerHtml': '<button class="toggle-submenu" role="button"></button>'
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
        if (this.opt.dropdownTogglerHtml) {
            jQuery(this.opt.dropdownTogglerHtml)
                .addClass('csn--dropdown-toggle')
                .attr('role', 'button')
                .insertBefore('.sidebar-navigation li' + this.opt.submenuContainerClass + ' > a, .sidebar-navigation li' + this.opt.submenuContainerClass + ' > strong')
            ;
        }

        // Add aria-expanded attribute and expanded class
        jQuery(`.sidebar-navigation li${this.opt.submenuContainerClass}:not(.trail)`)
            .removeClass('expanded')
            .find('.csn--dropdown-toggle')
            .attr('aria-expanded', 'false')
        ;

        // Expand submenu if nav item has the "trail" or "active" class.
        jQuery(`.sidebar-navigation li${this.opt.submenuContainerClass}.trail, .sidebar-navigation li${this.opt.submenuContainerClass}.active`)
            .addClass('expanded')
            .find('.csn--dropdown-toggle')
            .attr('aria-expanded', 'true')
        ;

        let arrTogglers = ['.sidebar-navigation.mod_navigation .csn--dropdown-toggle'];

        if (false === this.opt.followPageContainerLinks) {
            arrTogglers.push(`.sidebar-navigation.mod_navigation li${this.opt.pageContainerClass} > a`);
            arrTogglers.push(`.sidebar-navigation.mod_navigation li${this.opt.pageContainerClass} > strong`);

            const notClickableLinks = document.querySelectorAll(`.sidebar-navigation.mod_navigation li${this.opt.pageContainerClass} > a`);

            for (const notClickableLink of notClickableLinks) {
                // <a href="#" role="button">
                notClickableLink.setAttribute('href', '#');
                notClickableLink.setAttribute('role', 'button');
                notClickableLink.setAttribute('focusable', 'true');
            }
        }

        /**
         * Handle click events
         */
        setTimeout(() => {
            jQuery(arrTogglers.join(', ')).click((e) => {
                const dropdownToggler = e.target;
                e.preventDefault();
                e.stopPropagation();

                // Close menu
                jQuery(dropdownToggler).closest('li:not(.expanded)')
                    .find('li.expanded')
                    .removeClass('expanded')
                    .find('[aria-expanded]')
                    .attr('aria-expanded', 'false')
                    .closest('li')
                    .children('ul')
                    .slideUp()
                ;

                // Close opened siblings
                jQuery(dropdownToggler).closest('li')
                    .siblings('li.expanded')
                    .removeClass('expanded')
                    .find('[aria-expanded]')
                    .attr('aria-expanded', 'false')
                    .closest('li')
                    .children('ul')
                    .slideUp()
                ;

                // Toggle dropdown
                if (jQuery(dropdownToggler).closest('li').hasClass('expanded')) {
                    // Close (slide down)
                    jQuery(dropdownToggler).closest('li')
                        .find('> .csn--dropdown-toggle')
                        .attr('aria-expanded', 'false')
                        .closest('li')
                        .removeClass('expanded')
                        .children('ul')
                        .slideUp()
                    ;
                } else {
                    // Open (slide up)
                    jQuery(dropdownToggler).closest('li')
                        .find('> .csn--dropdown-toggle')
                        .attr('aria-expanded', 'true')
                        .closest('li')
                        .addClass('expanded')
                        .children('ul')
                        .slideDown()
                    ;
                }
            });
        }, 100);
    }
}