// 使用匿名函数包裹，使得代码不至于污染全局;
(function() {
  var clearAd = {
    clear: function() {
      var ad_tag_name = ['footer'];
      var ad_class_Name = ['top-banner-ad-container',
        'js-navigation-header',
        'content-footer',
        'l-footer u-cf',
        'site-message',
        'js-components-container',
        'content__secondary-column',
        'content__labels',
        'content__meta-container',
        'submeta'
      ]

      for (var i in ad_tag_name) {
        $(ad_tag_name[i]).hide()
      }

      for (var i in ad_class_Name) {
        $('.' + ad_class_Name[i]).hide()
      }

      return this;
    },
    intervalClear: function() {

      setInterval(function() {
        var ad_tag_name = ['aside', '#dfp-ad--inline1', 'dfp-ad--top-above-nav'];

        for (var i in ad_tag_name) {
          $(ad_tag_name[i]).hide()
        }
      }, 1000)

    }
  }

  clearAd.clear().intervalClear();

  var vScroll = {
    // 当前页数
    pageIndex: 0,
    pagesNum: 0,
    wrapBodyInner: function() {
      // 包裹body下面的子内容，用于移动
      $('body').wrapInner('<div class="body-children-wrap"></div>')
      return this;
    },
    scrollTo: function(page) {
      console.log(page)
      var vHeight = document.documentElement.clientHeight,
        wrap = document.querySelector('.body-children-wrap'),
        pagesBar = document.querySelector('.page-bar-ul')
      pagesList = pagesBar.children;
      console.log(pagesList)

      for (var i = 0; i < pagesList.length; i++) {
        console.log(pagesList[i])
        if (i == page) {
          pagesList[i].className = 'on';
        } else {
          pagesList[i].className = '';
        }
      }

      wrap.style.top = '-' + vHeight * page + 'px';
      return this;
    },
    calculatePages: function() {
      var vHeight = document.documentElement.clientHeight,
        wrap = document.querySelector('.body-children-wrap'),
        pagesNum = Math.ceil(parseInt(wrap.scrollHeight) / parseInt(vHeight));
      this.pagesNum = pagesNum;
      console.log(this.pagesNum)
      return this;
    },
    insertPagesBar: function() {
      var body = document.body,
        ul = document.createElement('ul');
      ul.className = 'page-bar-ul';
      for (var i = 0; i < this.pagesNum; i++) {
        // 再包裹一层匿名函数，解决js循环中的闭包问题
        (function(i) {
          li = document.createElement('li');
          var that = this;
          li.onclick = function() {
            console.log('1111')
            that.scrollTo(i)
          }
          li.className = '';
          li.dataset.num = i;
          if (i == 0) {
            li.className = 'on';
          }
          ul.appendChild(li);
        }.bind(this))(i)

      }

      body.appendChild(ul)

      return this;

    },
    init: function() {
      this.wrapBodyInner().calculatePages().insertPagesBar()
    }
  }
  vScroll.init();

})()