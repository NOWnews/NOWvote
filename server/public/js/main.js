$(function() {

    $(document).foundation();
    $('.title-bar').on('sticky.zf.stuckto:top', function() {
        $(this).addClass('shrink');
    }).on('sticky.zf.unstuckfrom:top', function() {
        $(this).removeClass('shrink');
    });

    // vote
    $('#vote-btn').on('click', function() {
        var voteFormDatas = $('.vote-form').serializeArray();
        var url = $('.vote-form').attr('action');
        var issueId = $('.vote-form').attr('issue-id');
        var issueSn = $('.vote-form').attr('issue-sn');
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
                console.log('L33', data);
            },
            error: function() {
                alert('error');
            }
        });
    });

    //大三小六
    $('.tabs').on('change.zf.tabs', function(e, tgt) {
        var tabchange = $('.is-active.tabs-title').find('a').attr('aria-controls');
        $('#' + tabchange + '>div').foundation('destroy');
        $('#' + tabchange + '>div').foundation();
    });
});
