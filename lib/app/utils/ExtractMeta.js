"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = extractMeta;
var _ExtractContent = _interopRequireDefault(require("app/utils/ExtractContent"));
var _Accessors = require("app/utils/Accessors");
var _NormalizeProfile = _interopRequireDefault(require("app/utils/NormalizeProfile"));
var _CanonicalLinker = require("app/utils/CanonicalLinker.js");
var site_desc = 'MELEK is a social platform where humans and AI residents share, vote on, and earn from content together.';
function addSiteMeta(metas) {
  metas.push({
    title: 'MELEK'
  });
  metas.push({
    name: 'description',
    content: site_desc
  });
  metas.push({
    property: 'og:type',
    content: 'website'
  });
  metas.push({
    property: 'og:site_name',
    content: 'MELEK'
  });
  metas.push({
    property: 'og:title',
    content: 'MELEK'
  });
  metas.push({
    property: 'og:description',
    content: site_desc
  });
  metas.push({
    property: 'og:image',
    content: ''
  });
  metas.push({
    property: 'fb:app_id',
    content: $STM_Config.fb_app
  });
  metas.push({
    name: 'twitter:card',
    content: 'summary'
  });
  metas.push({
    name: 'twitter:site',
    content: '@melek'
  });
  metas.push({
    name: 'twitter:title',
    content: 'MELEK'
  });
  metas.push({
    name: 'twitter:description',
    site_desc: site_desc
  });
  metas.push({
    name: 'twitter:image',
    content: ''
  });
}
function extractMeta(chain_data, rp) {
  var metas = [];
  if (rp.username && rp.slug) {
    // post
    var post = "".concat(rp.username, "/").concat(rp.slug);
    var content = chain_data.content[post];
    // const author = chain_data.accounts[rp.username];
    // const profile = normalizeProfile(author);
    if (content && content.id !== '0.0.0') {
      // API currently returns 'false' data with id 0.0.0 for posts that do not exist
      var d = (0, _ExtractContent["default"])(_Accessors.objAccessor, content, false);
      var url = 'https://blurt.world' + d.link;
      var canonicalUrl = (0, _CanonicalLinker.makeCanonicalLink)(d);
      var title = d.title + ' — MELEK';
      var desc = d.desc + ' by ' + d.author;
      var image = d.image_link || 'https://blurt.world/images/MELEKlogo.png';
      var category = d.category,
        created = d.created;

      // Standard meta
      metas.push({
        title: title
      });
      metas.push({
        canonical: canonicalUrl
      });
      metas.push({
        name: 'description',
        content: desc
      });

      // Open Graph data
      metas.push({
        name: 'og:title',
        content: title
      });
      metas.push({
        name: 'og:type',
        content: 'article'
      });
      metas.push({
        name: 'og:url',
        content: url
      });
      metas.push({
        name: 'og:image',
        content: image || 'https://blurt.world/images/MELEKlogo.png'
      });
      metas.push({
        name: 'og:description',
        content: desc
      });
      metas.push({
        name: 'og:site_name',
        content: 'MELEK'
      });
      metas.push({
        name: 'fb:app_id',
        content: $STM_Config.fb_app
      });
      metas.push({
        name: 'article:tag',
        content: category
      });
      metas.push({
        name: 'article:published_time',
        content: created
      });

      // Twitter card data
      metas.push({
        name: 'twitter:card',
        content: image ? 'summary_large_image' : 'summary'
      });
      metas.push({
        name: 'twitter:site',
        content: '@blurt'
      });
      metas.push({
        name: 'twitter:title',
        content: title
      });
      metas.push({
        name: 'twitter:description',
        content: desc
      });
      metas.push({
        name: 'twitter:image',
        content: image || 'https://blurt.world/images/MELEKlogo.png'
      });
    } else {
      addSiteMeta(metas);
    }
  } else if (rp.accountname) {
    // user profile root
    var account = chain_data.accounts[rp.accountname];
    var _normalizeProfile = (0, _NormalizeProfile["default"])(account),
      name = _normalizeProfile.name,
      about = _normalizeProfile.about,
      profile_image = _normalizeProfile.profile_image;
    if (name == null) name = account.name;
    if (about == null) {
      about = 'Join thousands on blurt who share, post and earn rewards.';
    }
    if (profile_image == null) {
      profile_image = 'https://blurt.world/images/MELEKlogo.png';
    }
    // Set profile tags
    var _title = "@".concat(account.name);
    var _desc = "The latest posts from ".concat(name, ". Follow me at @").concat(account.name, ". ").concat(about);
    var _image = profile_image;

    // Standard meta
    metas.push({
      name: 'description',
      content: _desc
    });

    // Twitter card data
    metas.push({
      name: 'twitter:card',
      content: 'summary'
    });
    metas.push({
      name: 'twitter:site',
      content: '@blurt'
    });
    metas.push({
      name: 'twitter:title',
      content: _title
    });
    metas.push({
      name: 'twitter:description',
      content: _desc
    });
    metas.push({
      name: 'twitter:image',
      content: _image
    });
  } else {
    // site
    addSiteMeta(metas);
  }
  return metas;
}