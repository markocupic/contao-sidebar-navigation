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

    navEl = null;

    opt = {
        'submenuContainerClass': '.submenu', 'pageContainerClass': '.page-container', // Not-clickable links
        'followPageContainerLinks': false, // Follow not-clickable links
        'dropdownTogglerHtml': '<button class="toggle-submenu" role="button"></button>'
    }

    constructor(navEl, options) {

        this.navEl = navEl;

        // Override defaults
        this.opt = {
            ...this.opt, ...options
        };

        this.initialize();
    }

    initialize() {

        // Inject the html markup for the dropdown toggle button to each nav item that contains child menus.
        (() => {
            if (this.opt.dropdownTogglerHtml) {
                let links = this.navEl.querySelectorAll(`li${this.opt.submenuContainerClass} > a, li${this.opt.submenuContainerClass} > strong`);

                for (const link of links) {
                    const toggler = document.createRange().createContextualFragment(this.opt.dropdownTogglerHtml).firstElementChild;
                    toggler.classList.add('csn--dropdown-toggle');
                    toggler.setAttribute('role', 'button');
                    link.insertAdjacentElement('beforebegin', toggler);
                }
            }
        })();

        // Add the "aria-expanded" attribute and the css class "expanded" to the open list item.
        (() => {
            let listItems = this.navEl.querySelectorAll(`li${this.opt.submenuContainerClass}:not(.trail)`);

            for (const listItem of listItems) {
                listItem.classList.remove('expanded');
                listItem.querySelector('.csn--dropdown-toggle')?.setAttribute('aria-expanded', 'false');
            }
        })();

        // Expand child menu if nav item has the css class "trail" or "active".
        (() => {
            const listItems = this.navEl.querySelectorAll(`li${this.opt.submenuContainerClass}.trail, li${this.opt.submenuContainerClass}.active`);
            for (const listItem of listItems) {
                listItem.classList.add('expanded');
                const togglers = listItem.querySelectorAll('.csn--dropdown-toggle');
                for (const toggler of togglers) {
                    toggler.setAttribute('aria-expanded', 'true');
                }
            }
        })();

        let arrTogglers = ['.csn--dropdown-toggle'];

        if (false === this.opt.followPageContainerLinks) {
            arrTogglers.push(`li${this.opt.pageContainerClass} > a`);
            arrTogglers.push(`li${this.opt.pageContainerClass} > strong`);

            const notClickableLinks = this.navEl.querySelectorAll(`li${this.opt.pageContainerClass} > a`);

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
            const togglers = this.navEl.querySelectorAll(arrTogglers.join(', '));

            for (const toggler of togglers) {
                toggler.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    const dropdownToggler = e.target;

                    // Close menu
                    (() => {
                        const listItem = dropdownToggler.closest('li:not(.expanded)');
                        if (listItem) {
                            const childListItems = listItem.querySelectorAll('li.expanded');

                            for (const childListItem of childListItems) {
                                childListItem.classList.remove('expanded');
                                const childLists = childListItem.querySelectorAll('ul');
                                for (const childList of childLists) {
                                    this.slideUp(childList);
                                }
                            }

                            const childTogglers = listItem.querySelectorAll('[aria-expanded]');

                            for (const childToggler of childTogglers) {
                                childToggler.setAttribute('aria-expanded', 'false');
                            }
                        }
                    })();

                    // Close opened siblings
                    (() => {
                        const listItems = this.getSiblings(dropdownToggler.closest('li'));
                        for (const listItem of listItems) {
                            listItem.classList.remove('expanded');
                            const togglers = listItem.querySelectorAll('[aria-expanded]');

                            for (const toggler of togglers) {
                                toggler.setAttribute('aria-expanded', 'false');
                            }

                            const lists = listItem.querySelectorAll('ul');

                            for (const list of lists) {
                                this.slideUp(list);
                            }
                        }
                    })();

                    // Toggle dropdown
                    (() => {
                        const listItem = dropdownToggler.closest('li');
                        if (listItem.classList.contains('expanded')) {
                            // Close (slide up)
                            const togglers = listItem.querySelectorAll(':scope > .csn--dropdown-toggle');

                            for (const toggler of togglers) {
                                toggler.setAttribute('aria-expanded', 'false');
                            }

                            listItem.classList.remove('expanded');
                            const lists = listItem.querySelectorAll(':scope > ul');

                            for (const list of lists) {
                                this.slideUp(list);
                            }
                        } else {
                            // Open (slide down)
                            const togglers = listItem.querySelectorAll(':scope > .csn--dropdown-toggle');

                            for (const toggler of togglers) {
                                toggler.setAttribute('aria-expanded', 'true');
                            }

                            listItem.classList.add('expanded');
                            const lists = listItem.querySelectorAll(':scope > ul');

                            for (const list of lists) {
                                this.slideDown(list);
                            }
                        }
                    })();
                });
            }
        }, 100);
    }

    getSiblings(el) {
        return Array.from(el.parentNode.children).filter(child => child !== el);
    }

    slideUp(el) {
        jQuery(el).slideUp();
    }

    slideDown(el) {
        jQuery(el).slideDown();
    }
}