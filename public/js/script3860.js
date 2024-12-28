$(document).ready(function () {
    var menu = $('#menu');

    /**
     * Toggle the mobile menu.
     *
     * This function toggles the visibility and size of the mobile menu. It
     * is bound to the "Menu" button at the top of the page, and is used
     * to show and hide the menu on mobile devices.
     */
    function toggleMenu() {
        menu.toggleClass('hidden');
        menu.toggleClass('w-full');
        menu.toggleClass('h-screen');
    }

    window.toggleMenu = toggleMenu;


    // bootstrap 5 collapse classes tailwind alternative
    $('[data-bs-toggle="collapse"]').each(function () {

        let target = $(this).attr('data-bs-target');

        // add visible class as collapse class is used to hide the element in tailwind
        $(target).css('visibility', 'visible');

        $(target).on('show.bs.collapse', function () {
            $(target).removeClass('hidden');
            // Collapse other sibling elements
            $(target).siblings('.collapse').each(function () {
                $(this).collapse('hide');
            });
        });

        $(target).on('hidden.bs.collapse', function () {
            $(target).addClass('hidden');
        });
    });

    // on download btns click event
    $('[id^="download-"]').on('click', function () {
        if ($(this).is(':disabled')) {
            return;
        }
        const name = $(this).attr('id').split('-')[1];
        const type = $(this).attr('id').split('-')[2];
        convertSvgQrCodeToOthers($('#qr-result img').attr('src'), type, name + '.' + type, $('#qr_size').val() ?? 500);
    });



    // on logo change
    handleLogoChange('input[name="logo"]', '#qr_code_logo_preview', '#remove_logo');

});


/**
 * Converts an SVG QR code to other image formats and triggers a download.
 *
 * @param {string} svgData - The SVG data or URL of the SVG image.
 * @param {string} type - The desired output image format (e.g., 'png', 'jpeg', 'jpg').
 * @param {string} name - The name for the downloaded file.
 * @param {number} [size=1000] - The width of the output image. The height is calculated based on the aspect ratio.
 */
function convertSvgQrCodeToOthers(svgData, type, name, size = 1000) {
    svgData = !svgData && $('#qr-result img').length ? $('#qr-result img').attr('src') : svgData;

    // if not svg then return
    if (!svgData || !svgData.startsWith('data:image/svg+xml')) {
        return;
    }

    size = $('#size').length ? $('#size').val() : size;

    const image = new Image();
    image.crossOrigin = 'anonymous';

    $(image).on('load', function () {
        const aspectRatio = image.naturalHeight / image.naturalWidth;
        const height = size * aspectRatio;

        const canvas = $('<canvas></canvas>')[0];
        canvas.width = size;
        canvas.height = height;

        const context = canvas.getContext('2d');
        context.drawImage(image, 0, 0, size, height);

        if (type === 'svg') {
            const link = $('<a></a>').attr({
                download: name,
                href: svgData
            }).css('opacity', '0').appendTo('body');
            link[0].click();
            link.remove();
        } else if (type === 'pdf') {
            const pdf = new jspdf.jsPDF({
                orientation: 'portrait',
                unit: 'px',
                format: 'a4'
            });

            const pageWidth = pdf.internal.pageSize.getWidth();
            const maxWidth = pageWidth - 40; // 20px margin on each side
            const ratio = maxWidth / size;
            const newWidth = size * ratio;
            const newHeight = height * ratio;
            const x = (pageWidth - newWidth) / 2;
            const y = 20; // 20px margin from the top

            pdf.addImage(canvas.toDataURL('image/png'), 'PNG', x, y, newWidth, newHeight);
            pdf.save(name.endsWith('.pdf') ? name : `${location.hostname}.pdf`);
        } else {
            type = type === 'jpg' ? 'jpeg' : type;

            if (type === 'jpeg') {
                // Fill the canvas with white background for JPEG
                context.fillStyle = '#ffffff';
                context.fillRect(0, 0, canvas.width, canvas.height);
                context.drawImage(image, 0, 0, size, height);
            }

            const data = canvas.toDataURL(`image/${type}`, 1);
            name = name.endsWith(`.${type}`) ? name : `${location.hostname}.${type}`;

            const link = $('<a></a>').attr({
                download: name,
                href: data
            }).css('opacity', '0').appendTo('body');
            link[0].click();
            link.remove();
        }
    });

    image.src = svgData;
}


/**
 * Scans a QR code from an image element specified by a selector.
 *
 * @param {string} imgSelector - The CSS selector for the image element containing the QR code.
 * @returns {Promise<string>} A promise that resolves with the QR code content, or rejects with an error.
 */
function scanQRCodeFromImage(imgSelector) {
    return new Promise((resolve, reject) => {
        const imgSrc = $(imgSelector).attr('src');
        if (!imgSrc) return reject('No image source found');

        $('body').append('<div id="reader" style="display:none"></div>');
        const html5QrCode = new Html5Qrcode("reader");

        fetch(imgSrc)
            .then(response => response.blob())
            .then(blob => html5QrCode.scanFile(new File([blob], "qr-code.html", { type: "image/svg+xml" }), true))
            .then(decodedText => resolve(decodedText))
            .catch(err => reject(err))
            .finally(() => $('#reader').remove());
    });
}

/**
 * Handles the change event for an input element to display a logo preview,
 * and manages the removal of the logo preview.
 *
 * @param {string} inputSelector - The CSS selector for the file input element.
 * @param {string} previewSelector - The CSS selector for the image element used to preview the logo.
 * @param {string} removeButtonSelector - The CSS selector for the button to remove the logo preview.
 */
function handleLogoChange(inputSelector, previewSelector, removeButtonSelector) {
    $(inputSelector).on('change', function (event) {
        const file = event.target.files[0];
        if (file) {

            $(`input[name="${$(inputSelector).attr('name')}_base64"]`).remove();

            const reader = new FileReader();
            reader.onload = function (e) {
                const preview = $(previewSelector);
                preview.attr('src', e.target.result).removeClass('hidden');
                $(removeButtonSelector).removeClass('hidden');

                // Add or update hidden input with base64 image data
                let hiddenInput = $(`input[name="${$(inputSelector).attr('name')}_base64"]`);
                if (hiddenInput.length === 0) {
                    hiddenInput = $('<input>').attr({
                        type: 'hidden',
                        name: `${$(inputSelector).attr('name')}_base64`
                    }).appendTo('form');
                }
                hiddenInput.val(e.target.result);
            };
            reader.readAsDataURL(file);
        } else {
            $(removeButtonSelector).trigger('click');
        }
    });

    $(removeButtonSelector).on('click', function (event) {
        event.preventDefault();
        const input = $(inputSelector);
        input.val('');
        const preview = $(previewSelector);
        preview.attr('src', '#').addClass('hidden');
        $(this).addClass('hidden');

        // Remove hidden input with base64 image data
        $(`input[name="${inputSelector.replace('input[name="', '').replace('"]', '')}_base64"]`).remove();
    });
}