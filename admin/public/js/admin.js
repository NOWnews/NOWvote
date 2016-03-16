$(function () {
    $(document).foundation();
    // Menu -----------------------
    // :: List
    // jquery-ui Sortable
    if($('.column').length !== 0){
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
            var url = $(this).attr('page-route');
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
            });
        });
    }

    // datepicker
    if($('#continued').length !== 0){
        var nowTemp = new Date();
        var startTime = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate(), 0, 0, 0, 0);
        var setTimepicker = function (type, dayElement, hourElement) {
            var day, hour;
            day = dayElement.fdatepicker({
                onRender: function (date) {
                    return date.valueOf() < startTime.valueOf() ? 'disabled' : '';
                },
                format: 'yyyy-mm-dd',
                language: 'zh-TW'
            }).on('changeDate', function (ev) {
                if (ev.date.valueOf() > hour.date.valueOf()) {
                    var newDate = new Date(ev.date);
                    hour.update(newDate);
                }
                day.hide();
                hourElement[0].focus();
            }).data('datepicker');

            hour = hourElement.fdatepicker({
                format: 'hh:ii',
                startView: 'day',
                language: 'zh-TW',
                onRender: function (date) {
                    return date.valueOf() !== day.date.valueOf() ? 'disabled': '';
                }
            }).on('changeDate', function (ev) {
                hour.hide();
            }).data('datepicker');
        };

        setTimepicker('start', $('#start-day'), $('#start-hour'));
        setTimepicker('end', $('#end-day'), $('#end-hour'));

        // continued
        $('#continued').change(function () {
            if (this.checked) {
                $('#start-day').prop( 'disabled', true );
                $('#start-hour').prop( 'disabled', true );
                $('#end-day').prop( 'disabled', true );
                $('#end-hour').prop( 'disabled', true );
                return $('#continued').val('checked');
            }
            $('#start-day').prop( 'disabled', false );
            $('#start-hour').prop( 'disabled', false );
            $('#end-day').prop( 'disabled', false );
            $('#end-hour').prop( 'disabled', false );
            return $('#continued').val('');
        });
    }

    // status
    $('#create-status').change(function () {
        if (this.checked) {
            return $('#create-status').val('checked');
        }
        return $('#create-status').val('');
    });


    // Banner -----------------------
    // :: List
    // jquery-ui Sortable

});
