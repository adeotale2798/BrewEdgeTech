(() => {
  function applySettings(content = {}) {
    const footer = content.footer || {}
    const footerTagline = document.querySelector('footer .footbrand > p')
    if (footerTagline) {
      footerTagline.className = 'footerTagline'
      footerTagline.replaceChildren(
        ...['IDEAS', 'BUILD', 'EVOLVE'].flatMap((word, index) => {
          const label = document.createElement('span')
          label.textContent = word
          if (index === 0) return [label]
          const divider = document.createElement('span')
          divider.className = 'footerTaglineDivider'
          divider.setAttribute('aria-hidden', 'true')
          divider.textContent = '|'
          return [divider, label]
        }),
      )
    }

    if (typeof footer.company === 'string' && footer.company.trim()) {
      document.querySelectorAll('.brand').forEach((brand) => {
        const name = brand.querySelector('b')
        if (!name) return
        const company = footer.company.trim()
        if (company === 'Brew EdgeTech') {
          const accent = document.createElement('span')
          accent.className = 'brandAccent'
          accent.textContent = 'EdgeTech'
          name.replaceChildren(document.createTextNode('Brew '), accent)
        } else {
          name.textContent = company
        }
      })
      const schema = document.querySelector('script[type="application/ld+json"]')
      if (schema) {
        try {
          const data = JSON.parse(schema.textContent)
          if (data['@type'] === 'Organization') {
            data.name = footer.company.trim()
            schema.textContent = JSON.stringify(data)
          }
        } catch (error) {
          console.error('Could not update organization structured data:', error)
        }
      }
    }

    const contactDetails = document.querySelector('footer .footcol:last-child p')
    if (contactDetails) {
      contactDetails.className = 'footerContactDetails'
      const lines = [footer.phone, footer.location]
        .filter((value) => typeof value === 'string' && value.trim())
        .map((value) => {
          const line = document.createElement('span')
          line.className = 'footerContactLine'
          line.textContent = value.trim()
          return line
        })
      contactDetails.replaceChildren(...lines)
    }
    if (typeof footer.email === 'string' && footer.email.trim()) {
      document.querySelectorAll('a[href^="mailto:"]').forEach((link) => {
        link.href = `mailto:${footer.email.trim()}`
        if (!link.textContent.trim() || link.textContent.includes('@')) {
          link.textContent = footer.email.trim()
        }
      })
    }

    const contact = document.querySelector('footer .footcol:last-child')
    if (contact) {
      let socialLinks = contact.querySelector('.site-social-links')
      const socials = [
        {
          label: 'Instagram',
          url: footer.instagram,
          markup: '<rect x="3" y="3" width="18" height="18" rx="5"></rect><circle cx="12" cy="12" r="4"></circle><circle cx="18" cy="6" r="1" fill="currentColor" stroke="none"></circle>',
        },
        {
          label: 'YouTube',
          url: footer.youtube,
          markup: '<path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4L15.8 12l-6.2 3.6Z"></path>',
        },
        {
          label: 'LinkedIn',
          url: footer.linkedin,
          markup: '<path d="M5.2 8.4H1.4V22h3.8V8.4ZM3.3 2a2.2 2.2 0 1 0 0 4.4 2.2 2.2 0 0 0 0-4.4ZM22 14.2c0-4.1-2.2-6-5.1-6a4.4 4.4 0 0 0-3.9 2.1V8.4H9.2V22H13v-6.7c0-1.8.3-3.5 2.5-3.5s2.2 2 2.2 3.6V22h3.8l.5-7.8Z"></path>',
        },
      ].filter((social) => typeof social.url === 'string' && /^https:\/\//i.test(social.url.trim()))
      if (socials.length) {
        if (!socialLinks) {
          socialLinks = document.createElement('div')
          socialLinks.className = 'site-social-links'
          socialLinks.setAttribute('aria-label', 'Social media')
          contact.appendChild(socialLinks)
        }
        socialLinks.replaceChildren(...socials.map(({ label, url, markup }) => {
          const link = document.createElement('a')
          link.href = url.trim()
          link.target = '_blank'
          link.rel = 'noopener noreferrer'
          link.setAttribute('aria-label', label)
          link.title = label
          const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
          icon.setAttribute('viewBox', '0 0 24 24')
          icon.setAttribute('aria-hidden', 'true')
          icon.setAttribute('focusable', 'false')
          icon.innerHTML = markup
          link.appendChild(icon)
          return link
        }))
      } else {
        socialLinks?.remove()
      }
    }

    document.querySelector('#siteAnnouncement')?.remove()
    if (typeof footer.banner === 'string' && footer.banner.trim()) {
      const banner = document.createElement('div')
      banner.id = 'siteAnnouncement'
      banner.textContent = footer.banner.trim()
      banner.style.cssText = 'position:relative;z-index:20;text-align:center;padding:10px;background:#0c1c4b;color:white;font-size:13px'
      if (typeof footer.banner_url === 'string' && /^https:\/\//i.test(footer.banner_url.trim())) {
        const link = document.createElement('a')
        link.href = footer.banner_url.trim()
        link.textContent = footer.banner.trim()
        link.style.color = 'white'
        link.target = '_blank'
        link.rel = 'noopener noreferrer'
        banner.replaceChildren(link)
      }
      document.body.prepend(banner)
    }
  }

  window.getPublishedSiteContent()
    .then(applySettings)
    .catch((error) => console.error('Could not load public site settings:', error))
})()
