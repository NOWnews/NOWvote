$(function () {
    $(document).foundation();
    // Menu -----------------------
    // :: List
    // jquery-ui Sortable
    var recordWeight = function (weightList) {
        $('input[name="weightList"]').val(weightList);
    };

    $('.column').sortable({
        connectWith: '.column',
        handle: '.portlet-header',
        cancel: '.portlet-toggle',
        placeholder: 'portlet-placeholder ui-corner-all',
        stop: function (event, ui) {
            var sortedWeight = $('.column').sortable('toArray', {attribute: 'item-sn'});
            $('#save-btn').removeClass('hide');
            recordWeight(sortedWeight);
        }
    });
    $('.portlet').addClass('ui-widget ui-widget-content ui-helper-clearfix ui-corner-all').find('.portlet-header').addClass('ui-widget-header ui-corner-all').prepend('<span class="ui-icon ui-icon-minusthick portlet-toggle"></span>');
    $('.portlet-toggle').click(function () {
        var icon = $(this);
        icon.toggleClass('ui-icon-minusthick ui-icon-plusthick');
        icon.closest('.portlet').find('.portlet-content').toggle();
    });

    $('.ui-table .switch-input').change(function () {
        $('#save-btn').removeClass('hide');
    });

    $('.remove-btn').on('click', function () {
        event.preventDefault();
        var sn = $(this).attr('item-sn');
        var url = '/menuCategory/' + sn;
        $.ajax({
            url: url,
            type: 'DELETE',
            success: function (data, err) {
                if (data.trashed) {
                    $('.bullet-item[item-sn=' + sn + ']').remove();
                    $('.column').sortable('refresh');
                    $('#deleteModal' + sn).foundation('close');
                    var sortedWeight = $('.column').sortable('toArray', {attribute: 'item-sn'});
                    recordWeight(sortedWeight);
                } else {
                    alert('資料有誤 請重新整理！');
                }
            }
        })
    })
    // Banner -----------------------

});
