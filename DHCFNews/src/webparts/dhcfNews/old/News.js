$(function(){
    var allNews = [];
    var locale = "en-us";
        $.ajax({
            url: _spPageContextInfo.siteAbsoluteUrl + "/intranet/_api/web/Lists/GetByTitle('Announcments')/items?"+
                "$top=5&$orderby=Announcement_x0020_Date desc" +
                "",
            type: "Get",
            async: false,
            headers: { 
                "Accept": "application/json;odata=verbose",
                "content-Type": "application/json;odata=verbose"
            }
        }).done(function(data){
               var data = data.d.results;
               $.each(data, function(i, item){
                    allNews.push({
                     Header: item.Title,
                     Description: item.Announcement_x0020_Description,
                     Date: new Date(item.Announcement_x0020_Date)
                 });
              });
        });
        allNews.sort(function(a,b) {
            return  new Date(b.Date) - new Date(a.Date);
        });

        allNews = allNews.slice(0, 5);
        //console.log(allFAQs);
        
        allNews.forEach(function(item){
            $('#all-news').append('<div class="news-item"><div class="news-date"><span class="month">' + item.Date.toLocaleString(locale, { month: "long" }) + '</span><br/><span class="day">'+ item.Date.getDate() +'</span></div><div class="news-info"><div class="news-header">' + item.Header + '</div><div class="news-desc">'+item.Description+'</div><div class="news-actions"><a href="#">Read more</a></div></div></div>');
        })
        
    //});
})
