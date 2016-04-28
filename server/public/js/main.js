$(function() {
    // 偵測瀏覽器
    var environmentChecks = function() {
        if (is.ie()) {
            swal({
                title: '非常抱歉!',
                text: '您的瀏覽器無法最佳瀏覽體驗 <br><br> <span class="browser-info">請使用 ' +
                    '<a class="chrome" target="_blank" href="https://www.google.com/chrome/browser/desktop/index.html">' +
                    '<i class="fa fa-chrome" aria-hidden="true"></i> chrome</a>' +
                    ' or ' +
                    '<a class="firefox" target="_blank" href="http://mozilla.com.tw/firefox/new/">' +
                    '<i class="fa fa-firefox" aria-hidden="true"></i> firefox</a> 來體驗</span>',
                type: 'warning',
                html: true
            });
        }
    };
    // 執行
    environmentChecks();

    $(document).foundation();
    $('.title-bar').on('sticky.zf.stuckto:top', function() {
        $(this).addClass('shrink');
    }).on('sticky.zf.unstuckfrom:top', function() {
        $(this).removeClass('shrink');
    });

    // user-receipt 建議的議題
    $('.user-receipt').on('click', function(){
        swal({
            title: '大膽做自己',
            text: '您可以將您的想法提供給我們！<br>讓我們一起讓世界變好。',
            type: 'input',
            html: true,
            showCancelButton: true,
            confirmButtonColor: '#DD6B55',
            confirmButtonText: '送出',
            cancelButtonText: '取消',
            closeOnConfirm: false,
            inputPlaceholder: '輸入你想說的話'
            },
            function(inputValue){
                if (inputValue === false) {
                    return false;
                }
                if (inputValue === '') {
                    swal.showInputError('你沒有寫任何文字唷!');
                    return false;
                }

                $.ajax({
                    url: '/user/receipt',
                    type: 'POST',
                    data: { text: inputValue },
                    success: function(data) {
                        swal('謝謝!', '您的建議是: ' + data.text, 'success');
                    },
                    error: function(error) {
                        var title = '資料有誤，請重新輸入';
                        if(error && error.responseText) {
                            title = JSON.parse(error.responseText).message;
                        }
                        swal({
                            title: title,
                            type: 'error'
                        });
                    }
                });
            }
        );
    });

    // vote
    $('#vote-btn').on('click', function() {
        var form = $('.vote-form');
        var voteFormDatas = form.serializeArray();
        var url = form.attr('action');
        var issueId = form.attr('issue-id');
        var issueSn = form.attr('issue-sn');
        var questions = _.map(voteFormDatas, function(date) {
            var optionIds = _.isArray(date.value) ? date.value : [date.value];
            var question = {
                questionId: date.name,
                optionIds: optionIds
            };
            return question;
        });
        var voteData = {
            issueId: issueId,
            issueSn: issueSn,
            questions: questions
        };
        $.ajax({
            url: url,
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify(voteData),
            success: function(data, err) {
                swal({
                    title: '投票完成摟!',
                    type: 'success'
                }, function(isConfirm) {
                    location.reload();
                });
            },
            error: function(error) {
                var title = '您已經投過票摟';
                if(error && error.responseText) {
                    title = JSON.parse(error.responseText).message;
                }
                swal({
                    title: title,
                    type: 'error'
                });
            }
        });
    });

    // 設定 redio 樣式
    $('.radioholder').each(function() {
        $(this).children().hide();
        var description = $(this).children('label').html();
        $(this).append('<span class="desc">' + description + '</span>');
        $(this).prepend('<span class="tick"></span>');
        // click 後更新 radio 區塊
        $(this).click(function() {
            $(this).children('input').prop('checked', true);
            $(this).children('input').trigger('change');
        });
    });
    // 當 radio 被更改，更動 redio 區塊裡面的 classes
    $('.radioholder > input[type=radio]').change(function() {
        $('input[type=radio]').each(function() {
            $(this).parent().removeClass('activeradioholder');
            if ($(this).prop('checked') === true) {
                $(this).parent().addClass('activeradioholder');
            }
        });
    });
    // 第一次啟動
    $('.radioholder > input[type=radio]').change();

    //大三小六
    $('.tabs').on('change.zf.tabs', function(e, tgt) {
        var tabchange = $('.is-active.tabs-title').find('a').attr('aria-controls');
        $('#' + tabchange + '>div').foundation('destroy');
        $('#' + tabchange + '>div').foundation();
    });

    //hamburger menu
    var $hamburger = $('.hamburger');
    var $container = $('.container');
    var $jsOffCanvasExit = $('.js-off-canvas-exit');
    var hamburgerClickFunc = function() {
        $hamburger.toggleClass('is-active');
        $container.toggleClass('show-sidebar');
    };

    $hamburger.on('click', hamburgerClickFunc);
    $jsOffCanvasExit.on('click', hamburgerClickFunc);

    //slick js
    $('.image-slick').slick({
        autoplay: true,
        dots: true,
        adaptiveHeight: true,
        respondTo: 'min'
    });

    // User
    $('#user-btn').on('click', function() {
        event.preventDefault();
        var form = $('.user-form');
        var voteFormDatas = form.serializeArray();
        var url = form.attr('action');
        var userId = form.attr('user-id');
        var userData = {};

        _.forEach(voteFormDatas, function(data){
            if (data.value.replace(/ /g, '') !== ''){
                userData[data.name] = data.value;
            }
        });

        $.ajax({
            url: url,
            type: 'put',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify(userData),
            success: function(data, err) {
                swal({
                    title: '更新成功!',
                    type: 'success'
                },function(isConfirm){
                    location.reload();
                });
            },
            error: function(error) {
                var title = '更新失敗';
                if(error && error.responseText) {
                    title = JSON.parse(error.responseText).message;
                }
                swal({
                    title: title,
                    type: 'error'
                });
            }
        });
    });

    $('.header').sticky({topSpacing:0});
    $('.mask').on('click', function(){
        $('.hamburger').click();
    });
});
