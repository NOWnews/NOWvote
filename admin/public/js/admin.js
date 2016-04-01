$(function() {
    $(document).foundation();
    // library
    // adminUser -----------------------
    $('.remove-btn').on('click', function() {
        event.preventDefault();
        var sn = $(this).attr('item-sn');
        var url = $(this).attr('page-route');
        $.ajax({
            url: url,
            type: 'DELETE',
            success: function(data, err) {
                if (data.trashed) {
                    $('.bullet-item[item-sn=' + sn + ']').remove();
                    $('#deleteModal' + sn).foundation('close');
                } else {
                    alert('資料有誤 請重新整理！');
                }
            }
        });
    });

    $('table .switch-input').change(function() {
        $('#save-btn').removeClass('hide');
    });

    // Menu -----------------------

    // externalLink 外部連結
    var checkedExternalLink = function () {
        var externalLink = $('#externalLink');
        var categoryUrl = $('#categoryUrl');
        var categoryTitle = $('#categoryTitle');

        if(externalLink.attr('checked')) {
            categoryUrl.attr('readonly', false);
        }else{
            categoryUrl.attr('readonly', true);
            categoryUrl.val('/categoty/' + categoryTitle.val());
        }
    };
    checkedExternalLink();

    // 當 input name 的時候的 event
    $('#categoryTitle').keyup(function(e) {
        if(!$('#externalLink').prop('checked')){
            $('#categoryUrl').val('/categoty/' + $(this).val());
        }
    });

    $('#externalLink').change(function() {
        var categoryUrl = $('#categoryUrl');
        var categoryTitle = $('#categoryTitle');

        if (this.checked) {
            categoryUrl.attr('readonly', false);
            categoryUrl.val('http://');
        }else{
            categoryUrl.attr('readonly', true);
            categoryUrl.val('/categoty/' + categoryTitle.val());
        }
    });


    // datepicker
    if ($('#continued').length !== 0) {
        var nowTemp = new Date();
        var startTime = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate(), 0, 0, 0, 0);
        var setTimepicker = function(type, dayElement, hourElement) {
            var day, hour;
            day = dayElement.fdatepicker({
                onRender: function(date) {
                    return date.valueOf() < startTime.valueOf() ? 'disabled' : '';
                },
                format: 'yyyy-mm-dd',
                language: 'zh-TW'
            }).on('changeDate', function(ev) {
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
                onRender: function(date) {
                    return date.valueOf() !== day.date.valueOf() ? 'disabled' : '';
                }
            }).on('changeDate', function(ev) {
                hour.hide();
            }).data('datepicker');
        };

        setTimepicker('start', $('#start-day'), $('#start-hour'));
        setTimepicker('end', $('#end-day'), $('#end-hour'));

        // continued
        $('#continued').change(function() {
            if (this.checked) {
                $('#start-day').prop('disabled', true);
                $('#start-hour').prop('disabled', true);
                $('#end-day').prop('disabled', true);
                $('#end-hour').prop('disabled', true);
                return $('#continued').val('checked');
            }
            $('#start-day').prop('disabled', false);
            $('#start-hour').prop('disabled', false);
            $('#end-day').prop('disabled', false);
            $('#end-hour').prop('disabled', false);
            return $('#continued').val('');
        });
    }

    // status
    $('#create-status').change(function() {
        if (this.checked) {
            return $('#create-status').val('checked');
        }
        return $('#create-status').val('');
    });


    // Banner -----------------------
    if($('.sortable').length !== 0) {
        var recordWeight = function(weightList) {
            $('input[name="weightList"]').val(weightList);
        };

        var sortableItemCount = $('.sortable > tr').children().length;

        $('.sortable').sortable({
            forcePlaceholderSize: true,
            items: 'tr',
            placeholder: '<tr><td colspan="'+ sortableItemCount +'">&nbsp;</td></tr>'
        }).bind('sortupdate', function() {

            var sortedWeightList = [];
            $(this).children().each(function(index, value) {
                var sn = $(value).attr('item-sn');
                sortedWeightList[index] = sn;
            });

            $('#save-btn').removeClass('hide');
            recordWeight(sortedWeightList);
        });
    }
    // :: fileupload使用
    var fileUpload = function(targetElement) {
        var readUrl = function(input) {
            var fileSize = input.files.size || input.files[0].size;
            var targetShow = $(input).siblings('label').find('img');

            if (fileSize > 409600) {
                return alert('檔案過大，請選擇小於500KB以下');
            }

            if (input.files && input.files[0]) {
                var reader = new FileReader();
                reader.onload = function(e) {
                    targetShow.attr('src', e.target.result);
                };
                reader.readAsDataURL(input.files[0]);
            }
        };

        $(targetElement).change(function() {
            readUrl(this);
        });
    };

    fileUpload('.img-input');

    // Issue -----------------------
    // :: sortable 設定
    if ($('.question-box').length !== 0) {
        var questions = [];
        var options = [];

        $(document).on('click', '.close-button', function(event) {
            var parentElement = $(this).parent();

            if (parentElement.prev().length === 1) {
                parentElement.prev().addClass('is-active');
                parentElement.prev().find('.accordion-content').show();
            } else if (parentElement.next().length === 1) {
                parentElement.next().addClass('is-active');
                parentElement.next().find('.accordion-content').show();
            }

            parentElement.remove();
        });

        $('.question-box').sortable({
            forcePlaceholderSize: true,
            placeholderClass: 'portlet-placeholder fade'
        });
        $('.option-box').sortable({
            forcePlaceholderSize: true,
            placeholderClass: 'portlet-placeholder fade',
            items: 'li',
            hoverClass: 'is-hovered'
        });

        var itemEnterFunc = function(targetBlock) {
            $(targetBlock + '+ .input-group > input').on('keypress', function(event) {
                if (event.which === 13) {
                    event.preventDefault();
                    $(this).siblings('div').find('a').click();
                }
            });
        };

        var optionClickFunc = function() {
            var inputElement = $(this).parents().siblings('input[type="text"]');

            if(!inputElement.val()){
                return;
            }

            var ulElement = $(this).parents().siblings('ol');
            var itemTitle = inputElement.val();
            var liHtml = '<li>' + itemTitle + '</li>';
            inputElement.val('');

            // 將 li 放進去，並加上 sortable 效果
            ulElement.append(liHtml);
            ulElement.sortable();
        };

        $('.add-option').on('click', optionClickFunc);
        $('.add-question').on('click', function() {
            var inputElement = $(this).parents().siblings('input[type="text"]');

            if(!inputElement.val()){
                return;
            }

            var ulElement = $(this).parents().siblings('ul');
            var itemTitle = inputElement.val();
            var liHtml =
                '<li class="accordion-item is-active" data-accordion-item>' +
                    '<a href="#" class="accordion-title">' + itemTitle + '</a>' +
                    '<button class="close-button" type="button">' +
                        '<i aria-hidden="true" class="fa fa-close"></i>' +
                    '</button>' +
                    '<div class="accordion-content" data-tab-content>' +
                        '<ol class="option-box"></ol>' +
                        '<div class="input-group">' +
                            '<input class="input-group-field" type="text" placeholder="新增選項"/>' +
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

    var checkedQuestionData;
    $('#issue-form').submit( function (event) {
        if (!checkedQuestionData) {
            event.preventDefault();
            checkedQuestionData = true;

            // 將 question 資料取出來變 object
            var question = {};
            $('.question-box > li').each( function(index, value) {
                question[index] = {
                    name: $(value).find('.accordion-title').text(),
                    option: []
                };
                $(value).find('li').each( function(i, v) {
                    question[index].option[i] = $(v).text();
                });
            });

            // 將 question 的資料轉成字串，並寫進 input question 裡面
            var questionString = JSON.stringify(question);
            $('input[name="question"]').val(questionString);
            return $(this).submit();
        }
    });

    // taggingJS
    if ($('.tag-box').length !== 0) {
        var my_custom_options = {
            'no-duplicate': true,
            'no-backspace': true,
            'tag-char': '',
            'tags-input-name': 'tags',
            'edit-on-delete': false,
            'forbidden-chars': [',', '.', '_', '?']
        };
        $('.tag-box').tagging(my_custom_options);
    }
});
