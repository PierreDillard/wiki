{#-
    This file was automatically generated - do not edit
  -#}
  {% import "partials/language.html" as lang with context %}
  <!doctype html>
  <html lang="{{ lang.t('language') }}" class="no-js">
    <head>
      {% block site_meta %}
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width,initial-scale=1">
        {% if page.meta and page.meta.description %}
          <meta name="description" content="{{ page.meta.description }}">
        {% elif config.site_description %}
          <meta name="description" content="{{ config.site_description }}">
        {% endif %}
        {% if page.meta and page.meta.author %}
          <meta name="author" content="{{ page.meta.author }}">
        {% elif config.site_author %}
          <meta name="author" content="{{ config.site_author }}">
        {% endif %}
        {% if page.canonical_url %}
          <link rel="canonical" href="{{ page.canonical_url }}">
        {% endif %}
        {% if page.previous_page %}
          <link rel="prev" href="{{ page.previous_page.url | url }}">
        {% endif %}
        {% if page.next_page %}
          <link rel="next" href="{{ page.next_page.url | url }}">
        {% endif %}
        {% if "rss" in config.plugins %}
          <link rel="alternate" type="application/rss+xml" title="{{ lang.t('rss.created') }}" href="{{ 'feed_rss_created.xml' | url }}">
          <link rel="alternate" type="application/rss+xml" title="{{ lang.t('rss.updated') }}" href="{{ 'feed_rss_updated.xml' | url }}">
        {% endif %}
        <link rel="icon" href="{{ config.theme.favicon | url }}">
        <meta name="generator" content="mkdocs-{{ mkdocs_version }}, mkdocs-material-9.5.27">
      {% endblock %}
      {% block htmltitle %}
        {% if page.meta and page.meta.title %}
          <title>{{ page.meta.title }} - {{ config.site_name }}</title>
        {% elif page.title and not page.is_homepage %}
          <title>{{ page.title | striptags }} - {{ config.site_name }}</title>
        {% else %}
          <title>{{ config.site_name }}</title>
        {% endif %}
      {% endblock %}
      {% block styles %}
        <link rel="stylesheet" href="{{ 'assets/stylesheets/main.6543a935.min.css' | url }}">
        {% if config.theme.palette %}
          {% set palette = config.theme.palette %}
          <link rel="stylesheet" href="{{ 'assets/stylesheets/palette.06af60db.min.css' | url }}">
        {% endif %}
        {% include "partials/icons.html" %}
      {% endblock %}
      {% block libs %}
        {% for script in config.extra.polyfills %}
          {{ script | script_tag }}
        {% endfor %}
      {% endblock %}
      {% block fonts %}
        {% if config.theme.font != false %}
          {% set text = config.theme.font.get("text", "Roboto") %}
          {% set code = config.theme.font.get("code", "Roboto Mono") %}
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family={{
              text | replace(' ', '+') + ':300,300i,400,400i,700,700i%7C' +
              code | replace(' ', '+') + ':400,400i,700,700i'
            }}&display=fallback">
          <style>:root{--md-text-font:"{{ text }}";--md-code-font:"{{ code }}"}</style>
        {% endif %}
      {% endblock %}
      {% for path in config.extra_css %}
        <link rel="stylesheet" href="{{ path | url }}">
      {% endfor %}
      {% include "partials/javascripts/base.html" %}
      {% block analytics %}
        {% include "partials/integrations/analytics.html" %}
      {% endblock %}
      {% if page.meta and page.meta.meta %}
        {% for tag in page.meta.meta %}
          <meta {% for key, value in tag.items() %} {{ key }}="{{value}}" {% endfor %}>
        {% endfor %}
      {% endif %}
      {% block extrahead %}{% endblock %}
    </head>
    {% set direction = config.theme.direction or lang.t("direction") %}
    {% if config.theme.palette %}
      {% set palette = config.theme.palette %}
      {% if not palette is mapping %}
        {% set palette = palette | first %}
      {% endif %}
      {% set scheme  = palette.scheme  | d("default", true) %}
      {% set primary = palette.primary | d("indigo", true) %}
      {% set accent  = palette.accent  | d("indigo", true) %}
      <body dir="{{ direction }}" data-md-color-scheme="{{ scheme | replace(' ', '-') }}" data-md-color-primary="{{ primary | replace(' ', '-') }}" data-md-color-accent="{{ accent | replace(' ', '-') }}">
    {% else %}
      <body dir="{{ direction }}">
    {% endif %}
      {% set features = config.theme.features or [] %}
      <input class="md-toggle" data-md-toggle="drawer" type="checkbox" id="__drawer" autocomplete="off">
      <input class="md-toggle" data-md-toggle="search" type="checkbox" id="__search" autocomplete="off">
      <label class="md-overlay" for="__drawer"></label>
      <div data-md-component="skip">
        {% if page.toc | first is defined %}
          {% set skip = page.toc | first %}
          <a href="{{ skip.url | url }}" class="md-skip">
            {{ lang.t("action.skip") }}
          </a>
        {% endif %}
      </div>
      <div data-md-component="announce">
        {% if self.announce() %}
          <aside class="md-banner">
            <div class="md-banner__inner md-grid md-typeset">
              {% if "announce.dismiss" in features %}
                <button class="md-banner__button md-icon" aria-label="{{ lang.t('announce.dismiss') }}">
                  {% set icon = config.theme.icon.close or "material/close" %}
                  {% include ".icons/" ~ icon ~ ".svg" %}
                </button>
              {% endif %}
              {% block announce %}{% endblock %}
            </div>
            {% if "announce.dismiss" in features %}
              {% include "partials/javascripts/announce.html" %}
            {% endif %}
          </aside>
        {% endif %}
      </div>
      {% if config.extra.version %}
        <div data-md-color-scheme="default" data-md-component="outdated" hidden>
          {% if self.outdated() %}
            <aside class="md-banner md-banner--warning">
              <div class="md-banner__inner md-grid md-typeset">
                {% block outdated %}{% endblock %}
              </div>
              {% include "partials/javascripts/outdated.html" %}
            </aside>
          {% endif %}
        </div>
      {% endif %}
      {% block header %}
        {% include "partials/header.html" %}
      {% endblock %}
      <div class="md-container" data-md-component="container">
        {% block hero %}{% endblock %}
        {% block tabs %}
          {% if "navigation.tabs.sticky" not in features %}
            {% if "navigation.tabs" in features %}
              {% include "partials/tabs.html" %}
            {% endif %}
          {% endif %}
        {% endblock %}
        <main class="md-main" data-md-component="main">
          <div class="md-main__inner md-grid">
            {% block site_nav %}
              {% if nav %}
                {% if page.meta and page.meta.hide %}
                  {% set hidden = "hidden" if "navigation" in page.meta.hide %}
                {% endif %}
                <div class="md-sidebar md-sidebar--primary" data-md-component="sidebar" data-md-type="navigation" {{ hidden }}>
                  <div class="md-sidebar__scrollwrap">
                    <div class="md-sidebar__inner">
                      {% include "partials/nav.html" %}
                    </div>
                  </div>
                </div>
              {% endif %}
              {% if "toc.integrate" not in features %}
                {% if page.meta and page.meta.hide %}
                  {% set hidden = "hidden" if "toc" in page.meta.hide %}
                {% endif %}
                <div class="md-sidebar md-sidebar--secondary" data-md-component="sidebar" data-md-type="toc" {{ hidden }}>
                  <div class="md-sidebar__scrollwrap">
                    <div class="md-sidebar__inner">
                      {% include "partials/toc.html" %}
                    </div>
                  </div>
                </div>
              {% endif %}
            {% endblock %}
            {% block container %}
              <div class="md-content" data-md-component="content">
                <article class="md-content__inner md-typeset">
                  {% block content %}
                    {% include "partials/content.html" %}
                  {% endblock %}
                </article>
              </div>
            {% endblock %}
            {% include "partials/javascripts/content.html" %}
          </div>
          {% if "navigation.top" in features %}
            {% include "partials/top.html" %}
          {% endif %}
        </main>
        {% block footer %}
          {% include "partials/footer.html" %}
        {% endblock %}
      </div>
      <div class="md-dialog" data-md-component="dialog">
        <div class="md-dialog__inner md-typeset"></div>
      </div>
      {% if "navigation.instant.progress" in features %}
        {% include "partials/progress.html" %}
      {% endif %}
      {% if config.extra.consent %}
        <div class="md-consent" data-md-component="consent" id="__consent" hidden>
          <div class="md-consent__overlay"></div>
          <aside class="md-consent__inner">
            <form class="md-consent__form md-grid md-typeset" name="consent">
              {% include "partials/consent.html" %}
            </form>
          </aside>
        </div>
        {% include "partials/javascripts/consent.html" %}
      {% endif %}
      {% block config %}
        {%- set app = {
          "base": base_url,
          "features": features,
          "translations": {},
          "search": "assets/javascripts/workers/search.b8dbb3d2.min.js" | url
        } -%}
        {%- if config.extra.version -%}
          {%- set mike = config.plugins.get("mike") -%}
          {%- if not mike or mike.config.version_selector -%}
            {%- set _ = app.update({ "version": config.extra.version }) -%}
          {%- endif -%}
        {%- endif -%}
        {%- if config.extra.tags -%}
          {%- set _ = app.update({ "tags": config.extra.tags }) -%}
        {%- endif -%}
        {%- set translations = app.translations -%}
        {%- for key in [
          "clipboard.copy",
          "clipboard.copied",
          "search.result.placeholder",
          "search.result.none",
          "search.result.one",
          "search.result.other",
          "search.result.more.one",
          "search.result.more.other",
          "search.result.term.missing",
          "select.version"
        ] -%}
          {%- set _ = translations.update({ key: lang.t(key) }) -%}
        {%- endfor -%}
        <script id="__config" type="application/json">
          {{- app | tojson -}}
        </script>
      {% endblock %}
      {% block scripts %}
        <script src="{{ 'assets/javascripts/bundle.ad660dcc.min.js' | url }}"></script>
        {% for script in config.extra_javascript %}
          {{ script | script_tag }}
        {% endfor %}
      {% endblock %}
    </body>
  </html>