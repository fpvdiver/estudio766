( function( $ ) {
    "use strict";

    var THE_STUDIO = window.THE_STUDIO || {};

    /*-------------------------------------------------------------------*/
    /*      Remove the page loader to the DOM
    /*-------------------------------------------------------------------*/

    THE_STUDIO.pageLoader = function(){

        setTimeout(function() {

            $('.content-loader').fadeOut(800, function(){
                $(this).remove();
            });

            // play header video background
            $('#video-background').trigger('play');

        }, 400);

    },

    /*-------------------------------------------------------------------*/
    /*      Magnific Popup Scritps
    /*-------------------------------------------------------------------*/

    THE_STUDIO.magnificPopup = function(){

        // open image
        $('.zoom').magnificPopup({
            type: 'image'
        });

        // open the appointment form in a popup
        $('.btn-popup').magnificPopup({
            type: 'inline',
        });

    },

    /*-------------------------------------------------------------------*/
    /*      Replace each select with a custom dropdown menu
    /*-------------------------------------------------------------------*/

    THE_STUDIO.selectReplacer = function(){

        $('select').each(function() {
            var $select = $(this),
                $ul = $('<ul></ul>').addClass('select-replacer'),
                $hiddenInput = $('<input type="hidden" name="' + $select.attr('name') + '" value="' + $select.val() + '">');

            $select.after($ul);
            $ul.after($hiddenInput);

            $select.children('option').each(function(){
                var $that = $(this),
                    $li = $('<li data-value="' + $that.val()+'">' + $that.text() + '</li>');
                if ( $that.attr('class') != undefined ) {
                    $li.addClass($that.attr('class'));
                }
                $ul.append($li);
            });

            $ul.children('li').not(':first').hide();

            $ul.children('li').on('click',function(){
                var $clickedLi = $(this),
                    dataValue = $clickedLi.data('value');
                $clickedLi.prependTo($ul.toggleClass('open')).nextAll().toggle();
                $hiddenInput.val(dataValue);
                $('.hidden-field').removeClass('show').find('input').removeClass('required');
                $('#' + $clickedLi.attr('class')).addClass('show').find('input').addClass('required');
            });

            $select.remove();

            //close the list by clicking outside of it
            $(document).on('click',function(e){

                if ( ! $ul.find(e.target).length ) {
                    $ul.removeClass('open').children('li').not(':first').hide();

                }

            });

        });

    },

    /*-------------------------------------------------------------------*/
    /*      Toggle
    /*-------------------------------------------------------------------*/

    THE_STUDIO.toggle = function(){

        $('.open .content-toggle').show();
        $('.title-toggle').on('click',function(e){
            e.preventDefault();

            var $that = $(this),
                $toggle = $that.parent(),
                $contentToggle = $that.next(),
                $accordion = $that.parents('.accordion');

            if ( $accordion.length > 0 ) {
                $accordion.find('.content-toggle').slideUp('normal', function(){
                    $(this).parent().removeClass('open');
                });
                if ( $that.next().is(':hidden') ) {
                    $contentToggle.slideDown('normal', function(){
                        $toggle.addClass('open');
                    });
                }
            } else {
                $contentToggle.slideToggle('normal', function(){
                    $toggle.toggleClass('open');
                });
            }
        });

    },

    /*-------------------------------------------------------------------*/
    /*      Tabs
    /*-------------------------------------------------------------------*/

    THE_STUDIO.tabs = function(){

        $('.title-tab:first-child').addClass('selected-tab');
        $('.title-tab').on('click',function(e){
            e.preventDefault();

            var $that = $(this),
                $tabParent = $that.parents('.tabs'),
                idTab = $that.find('a').attr('href');

            if ( ! $that.hasClass('selected-tab') ) {
                $tabParent.find('.tab').hide().removeClass('open');
                $tabParent.find('.title-tab').removeClass('selected-tab');
                $that.addClass('selected-tab');
                $(idTab).fadeIn().addClass('open');
            }

        });

    },

    /*-------------------------------------------------------------------*/
    /*      Portfolio Layout
    /*-------------------------------------------------------------------*/

    THE_STUDIO.portfolio = {

        init : function(){

            this.layout();
            this.filters();
            this.infoItems();

        },

        // build the portfolio layout
        layout : function(){

            $('.works').imagesLoaded( function() {
                $('.works').isotope();
            });

        },

        // filter items on button click
        filters : function(){

            $('.filters').on( 'click', 'a', function(e) {
                e.preventDefault();

                var $that = $(this),
                    filterValue = $that.attr('data-filter');

                $('.filters a').removeClass('light');
                $that.addClass('light');
                $('.works').isotope({ filter: filterValue });
            });

        },

        // open/close portfolio item information
        infoItems : function(){

            $('.info-link').on('click',function(e){
                e.preventDefault();

                var $that = $(this),
                    $extraItem = $that.parents('.work-thumb').next('.info-work');

                if ($extraItem.length > 0) {
                    $extraItem.slideToggle( 200, function(){
                        $(this).parents('.work').toggleClass('opened');
                        $('.works').isotope('layout');
                    });
                }

            });

        }

    },

    /*-------------------------------------------------------------------*/
    /*      Scroll to Section (One Page Version)
    /*-------------------------------------------------------------------*/

    THE_STUDIO.scrollToSection = function(){

        $('.one-page #nav-menu a[href^="#"]').on('click',function (e) {
            e.preventDefault();

            var target = this.hash,
                $section = $(target);

            $(this).parent().addClass('selected');
            $('html, body').stop().animate({
                scrollTop: $section.offset().top - 79
            }, 900, 'swing', function () {
                window.location.hash = target;
            });
            $('body').removeClass('open');
            $('#nav-menu').find('li').removeClass('show');

        });

    },

    /*-------------------------------------------------------------------*/
    /*      Highlight Navigation Link When Scrolling (One Page Version)
    /*-------------------------------------------------------------------*/

    THE_STUDIO.scrollHighlight = function(){

        var scrollPosition = $(window).scrollTop();

        if ( $('body').hasClass('one-page') ) {

            if (scrollPosition >= 200) {

                $('.section').each(function() {

                    var $link = $('#nav-menu a[href="#' + $(this).attr('id') +'"');
                    if ( $link.length && $(this).position().top <= scrollPosition + 80) {
                        $('#nav-menu li').removeClass('selected');
                        $link.parent().addClass('selected');
                    }
                });

            } else {

                $('#nav-menu li').removeClass('selected');

            }
        }

    },

    /*-------------------------------------------------------------------*/
    /*      Mobile Menu
    /*-------------------------------------------------------------------*/

    THE_STUDIO.mobileMenu = {

        init : function(){

            this.toggleMenu();
            this.addClassParent();
            this.addRemoveClasses();

        },

        // toggle mobile menu
        toggleMenu : function() {

            var self = this,
                $body = $('body');

            $('#nav-toggle').click(function(e){
                e.preventDefault();

                if ( $body.hasClass('open') ) {
                    $body.removeClass('open');
                    $('#nav-menu').find('li').removeClass('show');
                } else {
                    $body.addClass('open');
                    self.showSubmenu();
                }

            });

        },

        // add 'parent' class if a list item contains another list
        addClassParent : function() {

            $('#nav-menu').find('li > ul').each(function(){
                $(this).parent().addClass('parent');
            });

        },

        // add/remove classes to a certain window width
        addRemoveClasses : function() {

            var $nav = $('#nav-menu');

            if ( $(window).width() < 992 ) {
                $nav.addClass('mobile');
            } else {
                $('body').removeClass('open');
                $nav.removeClass('mobile').find('li').removeClass('show');
            }

        },

        // show sub menu
        showSubmenu : function() {

            $('#nav-menu').find('a').each(function(){

                var $that = $(this);

                if ( $that.next('ul').length ) {
                    $that.one('click', function(e) {
                        e.preventDefault();
                        $(this).parent().addClass('show');
                    });
                }

            });

        }

    },

    /*-------------------------------------------------------------------*/
    /*      Sticky Menu
    /*-------------------------------------------------------------------*/

    THE_STUDIO.stickyMenu = function(){

        if ($(window).scrollTop() > 50) {
            $('body').addClass('sticky');
        } else {
            $('body').removeClass('sticky');

        }

    },

    /*-------------------------------------------------------------------*/
    /*      Show/Hide Bottom Contacts Bar
    /*-------------------------------------------------------------------*/

    THE_STUDIO.contactsBar = function(){

        if ($(window).scrollTop() + $(window).height() > $('footer').offset().top) {
            $('#contacts-bar').fadeOut('fast');
        } else {
            $('#contacts-bar').fadeIn('fast');
        }

    },

    /*-------------------------------------------------------------------*/
    /*      Custom Backgrounds
    /*-------------------------------------------------------------------*/

    THE_STUDIO.backgrounds = function(){

        $.each( config.backgrouns, function( key, value ) {

            var $el = $(key),
                $overlay = $('<div class="bg-overlay"></div>');

            if ( value.img != null ) {
                $el.addClass('bg').css('background-image', 'url(' + value.img + ')').prepend($overlay);
            }

            if ( value.overlay != null && !value.disableOverlay ) {
                $el.find('.bg-overlay').remove();
            }

            if ( value.overlayOpacity != null ) {
                $el.find('.bg-overlay').css('opacity', value.overlayOpacity);
            }

            if ( value.overlayColor != null ) {
                $el.find('.bg-overlay').css('background-color', value.overlayColor);
            }

            if ( value.pattern != null && value.pattern ) {
                $el.addClass('pattern');
            }

            if ( value.position != null ) {
               $el.css('background-position', value.position);
            }

            if ( value.bgCover != null ) {
                $el.css('background-size', value.bgCover);
            }

            if ( value.parallax != null && value.parallax ) {
                $el.addClass('plx');
            }

        });

    },

    /*-------------------------------------------------------------------*/
    /*      Parallax
    /*-------------------------------------------------------------------*/

    THE_STUDIO.parallax = function(){

        $('.plx').each(function() {
            $(this).parallax('50%', 0.5);
        });

    },

    /*-------------------------------------------------------------------*/
    /*      Flexslider
    /*-------------------------------------------------------------------*/

    THE_STUDIO.flexslider = function(){

        $('.flexslider').each(function(){
            var $that = $(this),
                animationType = ( typeof $that.data('animation') !== 'undefined' ) ? $that.data('animation') : 'slide',
                autoplay = ( typeof $that.data('autoplay') !== 'undefined' ) ? $that.data('autoplay') : false;

            $that.flexslider({
                slideshow : autoplay,
                pauseOnHover : true,
                animation : animationType,
                prevText: '',
                nextText: '',
            });
        });

    },

    /*-------------------------------------------------------------------*/
    /*      Forms
    /*          1. Email Validator Function
    /*          2. Form Processor
    /*          3. Close Form Message
    /*-------------------------------------------------------------------*/

    THE_STUDIO.forms = function(){

        /* 1. Email validator
        /*-------------------------------------------------------------------*/
        var emailValidator = function(email){

            var emailReg = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
            var valid = emailReg.test(email);

            return valid;
        };

        /* 2. Form Processor
        -------------------------------------------------------------------*/
        // Add form message container
        $('form').append('<div class="form-msg" style="display:none"><span></span><a href="#"></a></div>');

        $('form').submit(function(e){
            e.preventDefault();

            var $that = $(this),
                checkEmpty = false,
                formMessages = config.formMessages,
                $msgForm = $that.find('.form-msg'),
                $msgText = $msgForm.find('span'),
                emailField = $that.find('input[name="email"]').val(),
                postData = $that.serialize();

            $msgForm.removeClass('fail success');
            $msgText.text('');

            // Check if all fields are not empty
            $that.find('.required').each(function() {
                if($.trim($(this).val()) === '' || $(this).is(':checkbox:not(:checked)') ) {
                    checkEmpty = true;
                }
            });

            // Stop all if there is at least one empty field
            if ( checkEmpty ) {
                $msgText.text(formMessages.emptyFields).parent().addClass('fail').fadeIn('fast');
                return false;
            }

            // Check if the email is valid. Otherwise stop all
            if ( ! emailValidator(emailField) ) {
                $msgText.text(formMessages.failEmail).parent().addClass('fail').fadeIn('fast');
                return false;
            }

            $that.find('.submit').after('<span class="form-loader" />');

            // Send data to the corresponding processing file
            $.post($that.attr('action'), postData, function(result){
                if (result == 'success') {
                    $msgText.text(formMessages.sent);               // success
                    $that.trigger('reset');                         // reset all form fields
                } else {
                    $msgText.text(formMessages.fail);               // fail
                }
            }).fail(function() {
                $msgText.text(formMessages.fail);                   // fail (problem with sending data)
            }).always(function(result) {
                $that.find('.form-loader').remove();
                $msgForm.addClass(result).fadeIn('fast');           // show form message
            });

        });

        /* 3. Close form messages
        -------------------------------------------------------------------*/
        $(document).on('click','.form-msg a', function(){

            $(this).parent().fadeOut();

            if ( $('.form-msg').hasClass('success') ) {
                $.magnificPopup.close();
            }

            return false;
        });

    };

    /*-------------------------------------------------------------------*/
    /*      Initialize all functions
    /*-------------------------------------------------------------------*/

    $(document).ready(function(){

        THE_STUDIO.magnificPopup();
        THE_STUDIO.selectReplacer();
        THE_STUDIO.toggle();
        THE_STUDIO.tabs();
        THE_STUDIO.portfolio.init();
        THE_STUDIO.scrollToSection();
        THE_STUDIO.mobileMenu.init();
        THE_STUDIO.forms();
        THE_STUDIO.backgrounds();
        THE_STUDIO.parallax();

    });

    // window load scripts
    $(window).load(function() {

        THE_STUDIO.pageLoader();
        THE_STUDIO.flexslider();

    });

    // window resize scripts
    $(window).resize(function() {

        THE_STUDIO.portfolio.layout();
        THE_STUDIO.mobileMenu.addRemoveClasses();

    });

    // window scroll scripts
    $(window).scroll(function() {

        THE_STUDIO.stickyMenu();
        THE_STUDIO.scrollHighlight();
        THE_STUDIO.contactsBar();

    });

} )( jQuery );