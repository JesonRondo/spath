{extends file="layout/demo/demo.tpl"}

{block "main"}

<ul class="post-list">
  {foreach $post_list as $item}
  <li>
    {if $item.type === 'image'}
    <div class="img-box">
      <img class="img-lazyload" src="" d-src="{$item.src}" width="480" height="{$item.height}" alt="">
    </div>
    {elseif $item.type === 'video'}
    <video width="480" height="{$item.height}" src="{$item.src}" autobuffer autoplay>
    </video>
    {/if}
    <blockquote>
      <p>[HQ] 20141121 IU for Chamisul Soju</p>
      <p>cr: <a href="javascript:;">TopStarNews</a></p>
    </blockquote>
    <div id="info">
      posted <a href="javascript:;">3 hours ago</a>
      with <a href="javascript:;">33 notes</a><br>
      via <a href="javascript:;">iumushimushi</a>
    </div>
    <br>
    <div class="my-like" title="Like"></div>
    /
    <a href="javascript:;"><font size="1">reblog</font></a>
  </li>
  {/foreach}
</ul>

{include file="home/module/term.tpl"}

{require_static file="home/script/require.config.js" debug="true"}
{require_static file="home/home.js"}
{require_static file="home/home.less"}

{/block}
