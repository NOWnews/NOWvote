$(function () {
    $(document).foundation();
    // library
    // adminUser -----------------------
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
                    $('#deleteModal' + sn).foundation('close');
                } else {
                    alert('資料有誤 請重新整理！');
                }
            }
        });
    });
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
    // :: fileupload使用
    var fileUpload = function (targetElement) {
        var readUrl = function (input) {
            var fileSize = input.files.size || input.files[0].size;
            var targetShow = $(input).siblings('label').find('img');

            if(fileSize > 409600) {
                return alert('檔案過大，請選擇小於500KB以下');
            }

            if (input.files && input.files[0]) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    targetShow.attr('src', e.target.result);
                };
                reader.readAsDataURL(input.files[0]);
            }
        };

        $(targetElement).change(function(){
          readUrl(this);
        });
    };

    fileUpload('.img-input');

    // Issue -----------------------
    // :: sortable 設定
    if($('.question-box').length !== 0) {
        $('.question-box').sortable({
            forcePlaceholderSize: true,
            placeholderClass: 'portlet-placeholder fade'
        });
        $('.option-box').sortable({
            forcePlaceholderSize: true,
            placeholderClass: 'portlet-placeholder fade',
            items: 'li'
        });

        var itemEnterFunc = function (targetBlock) {
            $(targetBlock + '+ .input-group > input').on('keypress', function(event){
                if ( event.which === 13 ) {
                    event.preventDefault();
                    $(this).siblings('div').find('a').click();
                }
            });
        };

        var optionClickFunc = function(){
            var inputElement = $(this).parents().siblings('input');
            var ulElement = $(this).parents().siblings('ol');
            var itemTitle = $(this).parents().siblings('input').val();
            var liHtml = '<li>' + itemTitle + '</li>';
            inputElement.val('');

            // 將 li 放進去，並加上 sortable 效果
            ulElement.append(liHtml);
            ulElement.sortable();
        };

        $('.add-option').on('click', optionClickFunc);
        $('.add-question').on('click', function(){
            var inputElement = $(this).parents().siblings('input');
            var ulElement = $(this).parents().siblings('ul');
            var itemTitle = inputElement.val();
            var liHtml =
                '<li class="accordion-item is-active" data-accordion-item>' +
                    '<a href="#" class="accordion-title">' + itemTitle + '</a>' +
                    '<div class="accordion-content" data-tab-content>' +
                        '<ol class="option-box"></ol>' +
                        '<div class="input-group">' +
                            '<input class="input-group-field" type="text" name="option" placeholder="新增選項"/>' +
                            '<div class="input-group-button"> <a class="add-option button">ADD</a> </div>' +
                        '</div>' +
                    '</div>' +
                '</li>';

            inputElement.val('');

            // 將 foundation 函式破壞，並刪除 active 效果
            ulElement.foundation('destroy').find('li').removeClass('is-active');
            // 將 li 放進去，並加上 foundation 跟 sortable 效果
            ulElement.append(liHtml).foundation().sortable();

            // 針對裡面的 option 做設定
            $('.is-active .add-option').on('click', optionClickFunc);
            itemEnterFunc('.is-active .option-box');
        });

        itemEnterFunc('.option-box');
        itemEnterFunc('.question-box');
    }

    // taggingJS
    if($('.tag-box').length !== 0) {
        var my_custom_options = {
            'no-duplicate': true,
            'no-backspace': true,
            'tag-char': '',
            'tags-input-name': 'taggone',
            'edit-on-delete': false,
            'forbidden-chars': [',', '.', '_', '?']
        };
        $('.tag-box').tagging(my_custom_options);
    }
});
