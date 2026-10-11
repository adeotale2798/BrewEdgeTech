(() => {
  if (typeof window.track !== 'function') {
    window.track = (eventName) => {
      if (!/^(responsive_demo_(desktop|tablet|phone)|product_demo_(nivara|fleet|striklenz)|configurator_used|enquiry_submitted)$/.test(eventName)) return
      fetch('/api/engagement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: eventName, page: location.pathname }),
        keepalive: true,
      }).then((response) => {
        if (!response.ok) throw new Error(`Engagement request failed (${response.status})`)
      }).catch((error) => console.error('Could not record engagement event:', error))
    }
  }

  const hero = document.getElementById('home')
  const ticker = document.querySelector('.ticker')
  const main = document.getElementById('main-content')
  const mobileExperience = document.getElementById('mobile-experience')
  const valueBand = document.querySelector('.valueBand')
  const menu = document.getElementById('menu')
  if (menu) menu.setAttribute('aria-controls', 'links')

  const navCta = document.querySelector('.navCta')
  if (navCta) {
    const arrow = navCta.querySelector('span')
    navCta.replaceChildren(document.createTextNode('Tell us about your project '))
    if (arrow) navCta.appendChild(arrow)
  }
  const heroEyebrow = hero?.querySelector('.eyebrow')
  if (heroEyebrow) heroEyebrow.textContent = '✧  DIGITAL EXPERIENCES, MADE FOR WHAT’S NEXT'

  const dashboard = document.querySelector('.heroVisual .screen')
  if (dashboard) {
    const heroVisual = dashboard.parentElement
    const progressCard = heroVisual.querySelector('.progressFloat')
    heroVisual.querySelector('.float.f2')?.remove()
    dashboard.classList.add('dashboardScreen')
    dashboard.setAttribute('aria-label', 'Illustrative business dashboard with simulated sample metrics')
    dashboard.innerHTML = `
      <div class="workspaceSidebar">
        <span class="workspaceBrand"><i aria-hidden="true"></i> BREW EDGE TECH</span>
        <span class="workspaceSideLabel">WORKSPACE</span>
        <span class="workspaceNav active"><i aria-hidden="true">▦</i> Dashboard</span>
        <span class="workspaceNav"><i aria-hidden="true">▣</i> Web Apps</span>
        <span class="workspaceNav"><i aria-hidden="true">▤</i> Mobile Apps</span>
        <span class="workspaceNav"><i aria-hidden="true">◇</i> UI/UX Design</span>
        <span class="workspaceNav"><i aria-hidden="true">☁</i> Cloud &amp; DevOps</span>
        <span class="workspaceNav"><i aria-hidden="true">✧</i> AI Automation</span>
        <span class="workspaceNav"><i aria-hidden="true">↗</i> Support</span>
      </div>
      <div class="workspaceMain">
        <div class="dashboardTopline">
          <span class="dashboardBrand"><i aria-hidden="true"></i> Brew EdgeTech · Workspace</span>
          <span class="dashboardSample">ILLUSTRATIVE · SAMPLE DATA</span>
        </div>
        <div class="dashboardHeading"><div><small>TURNING IDEAS</small><strong>Into impact</strong></div><span class="dashboardPeriod">Last 30 days <i aria-hidden="true">⌄</i></span></div>
        <div class="dashboardMetrics" aria-live="off">
          <article class="dashboardMetric"><span>Projects delivered</span><strong data-metric="projects">24</strong><small><i aria-hidden="true">↗</i> <b data-metric="delivery">+8%</b></small></article>
          <article class="dashboardMetric"><span>Client growth</span><strong data-metric="clients">18%</strong><small><i aria-hidden="true">↗</i> <b data-metric="growth">+12%</b></small></article>
          <article class="dashboardMetric"><span>User engagement</span><strong data-metric="engagement">2.4M</strong><small><i aria-hidden="true">↗</i> <b data-metric="engagementChange">+16%</b></small></article>
        </div>
        <div class="workspaceActionTiles" aria-label="Illustrative workspace activity">
          <div class="workspaceActionTile"><span class="workspaceActionIcon" aria-hidden="true">↗</span><span><small>ACTIVE BUILD</small><b>Web experience</b></span><strong>78%</strong></div>
          <div class="workspaceActionTile"><span class="workspaceActionIcon workspaceActionIconAi" aria-hidden="true">✦</span><span><small>SMART WORKFLOW</small><b>Automation flow</b></span><strong class="workspaceLive"><i></i> LIVE</strong></div>
        </div>
        <div class="dashboardChartHeading"><strong>Illustrative activity</strong><span>SIMULATED · LIVE PREVIEW</span></div>
        <div class="dashboardChart" aria-hidden="true">
          <div class="dashboardChartGrid"><i></i><i></i><i></i><i></i></div>
          <svg class="dashboardLineChart" viewBox="0 0 320 112" preserveAspectRatio="none">
            <defs><linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#2584ff" stop-opacity=".2"/><stop offset="100%" stop-color="#2584ff" stop-opacity="0"/></linearGradient></defs>
            <path class="dashboardArea" data-series="area"></path>
            <path class="dashboardLineGuide dashboardLineGuidePrimary" data-series="primary-guide"></path>
            <path class="dashboardLineGuide dashboardLineGuideSecondary" data-series="secondary-guide"></path>
            <path class="dashboardLine dashboardLinePrimary" pathLength="1" data-series="primary"></path>
            <path class="dashboardLine dashboardLineSecondary" pathLength="1" data-series="secondary"></path>
            <circle class="dashboardLineDot dashboardLineDotPrimary" r="3.5"><animateMotion dur="5s" repeatCount="indefinite" rotate="auto"><mpath href="#dashboardPrimaryLine"></mpath></animateMotion></circle>
            <circle class="dashboardLineDot dashboardLineDotSecondary" r="3"><animateMotion dur="6s" repeatCount="indefinite" rotate="auto"><mpath href="#dashboardSecondaryLine"></mpath></animateMotion></circle>
          </svg>
          <div class="dashboardChartBars"><i style="--bar:31%"></i><i style="--bar:43%"></i><i style="--bar:37%"></i><i style="--bar:57%"></i><i style="--bar:48%"></i><i style="--bar:72%"></i><i style="--bar:62%"></i><i style="--bar:84%"></i><i style="--bar:75%"></i><i style="--bar:96%"></i><i style="--bar:86%"></i><i style="--bar:100%"></i></div>
            <span class="dashboardChartSweep"></span>
          </div>
          <div class="dashboardMonths" aria-hidden="true"><span>JAN</span><span>MAR</span><span>MAY</span><span>JUL</span><span>SEP</span><span>NOV</span></div>
        <div class="workspaceSignalRow"><span><i aria-hidden="true">✓</i> Design review approved</span><b>JUST NOW</b></div>
      </div>`

    const primaryLine = dashboard.querySelector('.dashboardLinePrimary')
    const secondaryLine = dashboard.querySelector('.dashboardLineSecondary')
    const primaryGuide = dashboard.querySelector('.dashboardLineGuidePrimary')
    const secondaryGuide = dashboard.querySelector('.dashboardLineGuideSecondary')
    const area = dashboard.querySelector('.dashboardArea')
    if (primaryLine && secondaryLine && primaryGuide && secondaryGuide && area) {
      primaryLine.id = 'dashboardPrimaryLine'
      secondaryLine.id = 'dashboardSecondaryLine'
      const chartFrames = [
        { primary: [102, 94, 86, 88, 72, 76, 61, 65, 47, 49, 28, 12], secondary: [108, 101, 95, 84, 87, 71, 75, 57, 60, 41, 38, 21] },
        { primary: [104, 96, 90, 78, 82, 66, 69, 52, 56, 36, 40, 15], secondary: [106, 99, 88, 91, 76, 79, 62, 66, 48, 50, 31, 18] },
        { primary: [100, 93, 96, 80, 83, 68, 72, 54, 57, 39, 33, 10], secondary: [109, 102, 91, 94, 78, 72, 76, 59, 62, 44, 35, 20] },
      ]
      const chartPath = (values) => {
        const points = values.map((y, index) => ({
          x: index * (320 / (values.length - 1)),
          y,
        }))
        let path = `M${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`
        for (let index = 0; index < points.length - 1; index += 1) {
          const previous = points[Math.max(0, index - 1)]
          const current = points[index]
          const next = points[index + 1]
          const following = points[Math.min(points.length - 1, index + 2)]
          const controlOneX = current.x + (next.x - previous.x) / 6
          const controlOneY = current.y + (next.y - previous.y) / 6
          const controlTwoX = next.x - (following.x - current.x) / 6
          const controlTwoY = next.y - (following.y - current.y) / 6
          path += ` C${controlOneX.toFixed(1)} ${controlOneY.toFixed(1)} ${controlTwoX.toFixed(1)} ${controlTwoY.toFixed(1)} ${next.x.toFixed(1)} ${next.y.toFixed(1)}`
        }
        return path
      }
      const setChart = (primary, secondary) => {
        const primaryPath = chartPath(primary)
        const secondaryPath = chartPath(secondary)
        primaryLine.setAttribute('d', primaryPath)
        secondaryLine.setAttribute('d', secondaryPath)
        primaryGuide.setAttribute('d', primaryPath)
        secondaryGuide.setAttribute('d', secondaryPath)
        area.setAttribute('d', `${primaryPath} L320 112 L0 112 Z`)
      }
      let currentChart = {
        primary: [...chartFrames[0].primary],
        secondary: [...chartFrames[0].secondary],
      }
      setChart(currentChart.primary, currentChart.secondary)

      const animateChart = (target) => {
        const startedAt = performance.now()
        const initial = {
          primary: [...currentChart.primary],
          secondary: [...currentChart.secondary],
        }
        const duration = 1050
        const step = (now) => {
          const linear = Math.min(1, (now - startedAt) / duration)
          const progress = 1 - (1 - linear) ** 3
          currentChart = {
            primary: initial.primary.map((value, index) => value + (target.primary[index] - value) * progress),
            secondary: initial.secondary.map((value, index) => value + (target.secondary[index] - value) * progress),
          }
          setChart(currentChart.primary, currentChart.secondary)
          if (linear < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
      }

      const metricValues = [
        { projects: '24', delivery: '+8%', clients: '18%', growth: '+12%', engagement: '2.4M', engagementChange: '+16%' },
        { projects: '26', delivery: '+11%', clients: '21%', growth: '+15%', engagement: '2.6M', engagementChange: '+19%' },
        { projects: '25', delivery: '+9%', clients: '19%', growth: '+13%', engagement: '2.5M', engagementChange: '+17%' },
      ]
      let frameIndex = 0
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
      const updateDashboard = () => {
        if (document.hidden || reducedMotion.matches) return
        frameIndex = (frameIndex + 1) % metricValues.length
        dashboard.classList.add('dashboardTick')
        for (const [name, value] of Object.entries(metricValues[frameIndex])) {
          dashboard.querySelectorAll(`[data-metric="${name}"]`).forEach((metric) => {
            metric.textContent = value
          })
        }
        animateChart(chartFrames[frameIndex])
        dashboard.querySelectorAll('.dashboardChartBars i').forEach((bar, index) => {
          const value = chartFrames[frameIndex].primary[index] || 0
          bar.style.setProperty('--bar', `${100 - value}%`)
        })
        window.setTimeout(() => dashboard.classList.remove('dashboardTick'), 500)
      }
      window.setInterval(updateDashboard, 2400)
    }
    if (progressCard) dashboard.after(progressCard)

    const featureCards = document.createElement('div')
    featureCards.className = 'heroFeatureCards'
    featureCards.setAttribute('aria-label', 'What Brew EdgeTech creates')
    featureCards.innerHTML = `
      <a class="heroFeatureCard heroFeaturePurpose" href="#about">
        <span class="heroFeatureIcon heroFeaturePurposeIcon" aria-hidden="true"><svg viewBox="0 0 32 32"><path d="M16 3a9 9 0 0 0-5.7 16v3h11.4v-3A9 9 0 0 0 16 3Z" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/><path d="M12 26h8m-6 3h4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="m16 7 1.2 3.2 3.3 1.2-3.3 1.2L16 16l-1.2-3.4-3.3-1.2 3.3-1.2z" fill="currentColor"/></svg></span>
        <span class="heroFeatureCopy"><small>BUILT WITH PURPOSE</small><strong>Ideas into impact</strong></span><span class="heroFeatureArrow" aria-hidden="true">↗</span>
      </a>
      <a class="heroFeatureCard heroFeatureWeb" href="#services">
        <span class="heroFeatureIcon heroFeatureWebIcon" aria-hidden="true"><svg viewBox="0 0 32 32"><path d="M5 7.5A2.5 2.5 0 0 1 7.5 5h17A2.5 2.5 0 0 1 27 7.5v12a2.5 2.5 0 0 1-2.5 2.5h-17A2.5 2.5 0 0 1 5 19.5z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M5 11h22M11 27h10m-5-5v5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="m12 16 3 3 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
        <span class="heroFeatureCopy"><small>MADE FOR YOUR NEXT MOVE</small><strong>Web applications</strong><span class="heroFeaturePeople"><i>A</i><i>B</i><i>C</i><b>+</b></span></span><span class="heroFeatureArrow" aria-hidden="true">→</span>
      </a>
      <a class="heroFeatureCard heroFeatureMobile" href="#mobile-experience">
        <span class="heroFeatureIcon heroFeatureMobileIcon" aria-hidden="true"><svg viewBox="0 0 32 32"><rect x="8" y="3" width="16" height="26" rx="3" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="M13 7h6m-4 18h2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="m16 12 3 3-3 3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
        <span class="heroFeatureCopy"><small>EVERY SCREEN, ONE EXPERIENCE</small><strong>Mobile experiences</strong><span class="heroFeaturePlatforms"><i aria-hidden="true">●</i><b>iOS</b><i aria-hidden="true">◆</i><b>Android</b></span></span><span class="heroFeatureArrow" aria-hidden="true">→</span>
      </a>`
    dashboard.after(featureCards)
  }

  const defaultTechnologies = ['React', 'Next.js', 'Node.js', 'Python', 'AWS', 'Azure', 'MongoDB', 'Docker']
  const technologyIcons = {
    react: 'react.svg',
    'next.js': 'nextjs.svg',
    'node.js': 'nodejs.svg',
    python: 'python.svg',
    aws: 'aws.svg',
    azure: 'azure.svg',
    mongodb: 'mongodb.svg',
    docker: 'docker.svg',
  }
  const heroTechStack = document.createElement('section')
  heroTechStack.className = 'heroTechStack'
  heroTechStack.setAttribute('aria-label', 'Technologies we work with')
  heroTechStack.innerHTML = `
    <strong>WE WORK WITH<br>MODERN TECHNOLOGIES</strong>
    <div class="techStackViewport" role="group" aria-label="Technology list">
      <div class="techStackTrack"><div class="techStackGroup" role="list"></div></div>
    </div>`

  const techTrack = heroTechStack.querySelector('.techStackTrack')
  const techViewport = heroTechStack.querySelector('.techStackViewport')
  let currentTechnologies = [...defaultTechnologies]
  const reducedMotionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')

  function renderTechnologyStack(input) {
    const seen = new Set()
    const technologies = (Array.isArray(input) ? input : [])
      .filter((name) => typeof name === 'string')
      .map((name) => name.trim().slice(0, 48))
      .filter((name) => {
        const key = name.toLocaleLowerCase()
        if (!key || seen.has(key)) return false
        seen.add(key)
        return true
      })
    currentTechnologies = technologies.length ? technologies : [...defaultTechnologies]
    const shouldScroll = currentTechnologies.length > 0 && !reducedMotionPreference.matches
    heroTechStack.classList.add('has-overflow')
    heroTechStack.classList.toggle('is-scrolling', shouldScroll)
    techTrack.replaceChildren()

    const createGroup = () => {
      const group = document.createElement('div')
      group.className = 'techStackGroup'
      group.setAttribute('role', 'list')
      currentTechnologies.forEach((name) => {
        const item = document.createElement('span')
        item.className = 'techStackItem'
        item.setAttribute('role', 'listitem')
        const icon = technologyIcons[name.toLocaleLowerCase()]
        if (icon) {
          const image = document.createElement('img')
          image.src = `/tech-logos/${icon}`
          image.alt = ''
          image.setAttribute('aria-hidden', 'true')
          item.appendChild(image)
        } else {
          const glyph = document.createElement('span')
          glyph.className = 'techStackGlyph'
          glyph.setAttribute('aria-hidden', 'true')
          glyph.textContent = name.slice(0, 2).toUpperCase()
          item.appendChild(glyph)
        }
        const label = document.createElement('span')
        label.textContent = name
        item.appendChild(label)
        group.appendChild(item)
      })
      return group
    }

    const firstGroup = createGroup()
    techTrack.appendChild(firstGroup)
    if (shouldScroll) {
      const groupWidth = firstGroup.getBoundingClientRect().width
      const viewportWidth = techViewport.clientWidth
      const groupCount = Math.max(2, Math.ceil(viewportWidth / groupWidth) + 1)
      for (let index = 1; index < groupCount; index += 1) {
        const repeatedGroup = createGroup()
        repeatedGroup.setAttribute('aria-hidden', 'true')
        techTrack.appendChild(repeatedGroup)
      }
      heroTechStack.style.setProperty('--tech-loop-distance', `${groupWidth}px`)
      heroTechStack.style.setProperty('--tech-scroll-duration', `${Math.max(12, groupWidth / 36)}s`)
    }
  }

  hero?.querySelector('.heroScrollCue')?.before(heroTechStack)
  renderTechnologyStack(defaultTechnologies)
  reducedMotionPreference.addEventListener?.('change', () => renderTechnologyStack(currentTechnologies))
  if (typeof ResizeObserver === 'function') {
    const technologyStackObserver = new ResizeObserver(() => renderTechnologyStack(currentTechnologies))
    technologyStackObserver.observe(heroTechStack.querySelector('.techStackViewport'))
  }
  if (typeof window.getPublishedSiteContent === 'function') {
    window.getPublishedSiteContent()
      .then((content) => renderTechnologyStack(content?.technology_stack?.items || defaultTechnologies))
      .catch((error) => console.error('Could not load published technology stack:', error))
  }

  if (hero && ticker && hero.nextElementSibling !== ticker) hero.after(ticker)
  if (mobileExperience && valueBand && mobileExperience.nextElementSibling !== valueBand) {
    mobileExperience.after(valueBand)
  }
  const contactPrompts = [
    ['services', 'Planning a new website or product?', 'Share the outcome you’re aiming for. We’ll help you find a practical way to get there.'],
    ['work', 'Exploring a digital product?', 'Let’s shape a considered experience around your audience and goals.'],
    ['process', 'Want to know what comes next?', 'Start with a conversation about your goals, constraints and the right next step.'],
  ]
  for (const [sectionId, heading, description] of contactPrompts) {
    const section = document.getElementById(sectionId)
    if (!section || section.nextElementSibling?.classList.contains('sectionContactPrompt')) continue
    const prompt = document.createElement('aside')
    prompt.className = 'sectionContactPrompt'
    prompt.setAttribute('aria-label', 'Discuss a project')
    const copy = document.createElement('div')
    const title = document.createElement('h3')
    title.textContent = heading
    const detail = document.createElement('p')
    detail.textContent = description
    copy.append(title, detail)
    const link = document.createElement('a')
    link.className = 'btn'
    link.href = '#contact'
    link.append(document.createTextNode('Discuss a Project '))
    const arrow = document.createElement('span')
    arrow.setAttribute('aria-hidden', 'true')
    arrow.textContent = '↗'
    link.appendChild(arrow)
    prompt.append(copy, link)
    section.after(prompt)
  }

  const responsivePreview = document.querySelector('#mobile-experience .responsiveDemo')
  if (responsivePreview) {
    responsivePreview.setAttribute('aria-label', 'Sample dashboard previews in desktop, tablet, and phone layouts')
    responsivePreview.closest('.mobileCard')?.querySelector('.responsiveControls')?.remove()
  }

  const enquiryNote = document.getElementById('note')
  const enquiryForm = enquiryNote?.closest('form')
  if (enquiryNote && enquiryForm) {
    const defaultNote = enquiryNote.textContent.trim()
    const showConfirmation = () => {
      if (!enquiryNote.classList.contains('success') || enquiryForm.classList.contains('is-submitted')) return
      const confirmationText = enquiryNote.textContent.trim()
      enquiryForm.classList.add('is-submitted')

      const icon = document.createElement('span')
      icon.className = 'enquiryConfirmationIcon'
      icon.setAttribute('aria-hidden', 'true')
      icon.textContent = '✓'

      const content = document.createElement('div')
      content.className = 'enquiryConfirmationContent'
      const eyebrow = document.createElement('span')
      eyebrow.className = 'enquiryConfirmationEyebrow'
      eyebrow.textContent = 'ENQUIRY RECEIVED'
      const heading = document.createElement('h3')
      heading.textContent = 'Thank you. We’ll take it from here.'
      const message = document.createElement('p')
      message.textContent = confirmationText.includes('our team has been notified')
        ? 'Your project details are saved and our team has been notified.'
        : 'Your project details are saved securely.'
      const nextSteps = document.createElement('ul')
      nextSteps.className = 'enquiryConfirmationSteps'
      for (const stepText of ['Our team will review your project details.', 'We’ll follow up using the email you provided.']) {
        const step = document.createElement('li')
        step.textContent = stepText
        nextSteps.appendChild(step)
      }
      const reset = document.createElement('button')
      reset.className = 'enquiryConfirmationReset'
      reset.type = 'button'
      reset.textContent = 'Send another enquiry'
      reset.addEventListener('click', () => {
        enquiryForm.classList.remove('is-submitted')
        enquiryNote.classList.remove('success')
        enquiryNote.replaceChildren(document.createTextNode(defaultNote))
        enquiryForm.reset()
        enquiryForm.querySelector('input, select, textarea')?.focus()
      })
      content.append(eyebrow, heading, message, nextSteps, reset)
      enquiryNote.replaceChildren(icon, content)
    }
    new MutationObserver(showConfirmation).observe(enquiryNote, {
      attributes: true,
      attributeFilter: ['class'],
      childList: true,
      characterData: true,
      subtree: true,
    })
  }

  const visibilityStyle = document.createElement('style')
  visibilityStyle.textContent = `
    [hidden]{display:none!important}
    .brand .mark,.mark{width:48px!important;height:48px!important;flex:0 0 48px!important;background:url('/favicon.svg?v=2') center/contain no-repeat!important;border-radius:0!important;box-shadow:none!important;filter:none!important;overflow:visible!important;transform:none!important}
    #mobile-experience .responsiveDemo{display:flex!important;align-items:flex-end!important;justify-content:center!important;gap:clamp(7px,1.4vw,14px)!important;width:100%!important;height:clamp(210px,22vw,260px)!important;min-height:210px!important;position:relative!important;overflow:hidden!important;box-sizing:border-box!important;padding:28px 12px 18px!important}
    #mobile-experience .responsiveDemo:before{content:'ALL SCREENS · ONE EXPERIENCE'!important;top:10px!important;font-size:7px!important;letter-spacing:1.1px!important}
    #mobile-experience .responsiveDemo:after{content:none!important}
    #mobile-experience .responsiveControls{display:none!important}
    #mobile-experience .deviceLabels{display:grid!important;grid-template-columns:minmax(0,57fr) minmax(0,24fr) minmax(42px,12fr)!important;gap:clamp(7px,1.4vw,14px)!important;width:calc(100% - 24px)!important;margin:6px auto 2px!important;text-align:center!important;color:#71809b!important;font-size:10px!important;font-weight:700!important;line-height:1.3!important}
    #mobile-experience .responsiveDemo .responsiveDesktop,#mobile-experience .responsiveDemo .responsiveTablet,#mobile-experience .responsiveDemo .responsivePhone{display:block!important;position:relative!important;inset:auto!important;align-self:flex-end!important;flex-shrink:1!important;min-width:0!important;max-width:none!important;margin:0!important;box-sizing:border-box!important;transform:none!important;opacity:1!important;filter:none!important;transition:none!important}
    #mobile-experience .responsiveDemo .responsiveDesktop{width:57%!important;height:clamp(108px,15vw,150px)!important;flex:0 1 57%!important;z-index:2!important}
    #mobile-experience .responsiveDemo .responsiveTablet{width:24%!important;height:clamp(112px,15vw,145px)!important;flex:0 1 24%!important;z-index:2!important}
    #mobile-experience .responsiveDemo .responsivePhone{width:12%!important;min-width:42px!important;height:clamp(122px,17vw,160px)!important;flex:0 1 12%!important;z-index:2!important}
    #mobile-experience .dummySite{display:flex;flex-direction:column;gap:4px;width:100%;height:100%;padding:9px 11px;overflow:hidden;background:#f8faff;color:#17264b;font-family:Inter,system-ui,sans-serif;line-height:1.2}
    #mobile-experience .dummyTop{display:flex;align-items:center;gap:4px;min-width:0;min-height:9px;overflow:hidden}
    #mobile-experience .dummyTop>i{width:4px;height:4px;flex:0 0 4px;border-radius:50%;background:#a3b1ce}
    #mobile-experience .dummyBrand{margin-left:5px;font-size:7px;font-weight:800;white-space:nowrap}
    #mobile-experience .dummySample{margin-left:auto;font-size:6px;font-weight:700;letter-spacing:.04em;color:#7181a0;white-space:nowrap}
    #mobile-experience .dummyTitle{margin:4px 0 2px;font-size:10px;font-weight:750;line-height:1.2}
    #mobile-experience .dummyStats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:4px}
    #mobile-experience .dummyMetric{display:flex;align-items:center;justify-content:space-between;gap:3px;min-width:0;padding:5px;border-radius:4px;background:#edf2fc}
    #mobile-experience .dummyMetric span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:6px;color:#63728e}
    #mobile-experience .dummyMetric b{font-size:7px;color:#243e72}
    #mobile-experience .dummyChartLabel{margin-top:2px;font-size:6px;color:#63728e}
    #mobile-experience .dummyChart{display:flex;flex:1;align-items:flex-end;gap:3px;min-height:24px;padding:3px 5px;border-radius:4px;background:#edf2fc}
    #mobile-experience .dummyChart i{display:block;flex:1;min-width:0;border-radius:2px 2px 0 0;background:linear-gradient(#49c9d3,#6d63ee)}
    #mobile-experience .dummyRows{display:flex;justify-content:space-between;gap:4px;flex:0 0 auto;padding-top:4px;border-top:1px solid #e2e8f5;font-size:6px}
    #mobile-experience .dummyRows span{color:#7181a0}
    #mobile-experience .dummyRows b{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    #mobile-experience .responsivePhone .dummySite{gap:3px;padding:7px 5px}
    #mobile-experience .responsivePhone .dummyBrand{font-size:6px}
    #mobile-experience .responsivePhone .dummySample{display:none}
    #mobile-experience .responsivePhone .dummyTitle{font-size:7px}
    #mobile-experience .responsivePhone .dummyStats{grid-template-columns:1fr;gap:2px}
    #mobile-experience .responsivePhone .dummyMetric{padding:3px}
    #mobile-experience .responsivePhone .dummyChart{min-height:18px}
    #mobile-experience .responsivePhone .dummyRows{display:none}
    @media(max-width:680px){#mobile-experience .responsiveDemo{height:210px!important;min-height:210px!important;gap:7px!important;padding:26px 8px 15px!important}#mobile-experience .responsiveDemo .responsiveDesktop{height:108px!important}#mobile-experience .responsiveDemo .responsiveTablet{height:112px!important}#mobile-experience .responsiveDemo .responsivePhone{height:122px!important;min-width:42px!important}#mobile-experience .deviceLabels{width:calc(100% - 16px)!important;gap:7px!important;font-size:9px!important}}
    .mobileExperience .siteDemoFrame{display:block;width:100%;height:100%;border:0;background:#fff}
    .portfolioProjectVisual{display:grid;place-items:center;min-height:180px;padding:24px;background:radial-gradient(ellipse at 50% 30%,#7558df66,transparent 70%),linear-gradient(135deg,#111a39,#1a2a52);color:#e8edff;text-align:center;font-size:13px;font-weight:750;letter-spacing:.12em}
  `
  document.head.appendChild(visibilityStyle)

  const sectionDefinitions = [
    ['.ticker', 'Capabilities ticker'],
    ['#services', 'Services'],
    ['#mobile-experience', 'Mobile experience'],
    ['#work', 'Selected work'],
    ['#about', 'About'],
    ['#testimonials', 'Testimonials'],
    ['#pricing', 'Quotes / pricing'],
    ['#estimator', 'Project configurator'],
    ['#process', 'How we work'],
    ['#faq', 'FAQs'],
    ['#contact', 'Contact'],
    ['footer', 'Footer'],
  ]
  const legacySelectors = {
    '#pricing': ['.priceGrid'],
    '#faq': ['.faq', '.faqgrid'],
    '#work': ['.projects'],
  }

  function prepareFaqNavigation() {
    const faq = document.querySelector('section.faq')
    const navigation = document.querySelector('.links')
    if (faq && !faq.id) faq.id = 'faq'
    if (!faq || !navigation) return

    const processLink = navigation.querySelector('a[href="#process"]')
    if (processLink?.textContent.includes('FAQs')) processLink.textContent = 'How We Work'
    if (!navigation.querySelector('a[href="#faq"]')) {
      const link = document.createElement('a')
      link.href = '#faq'
      link.textContent = 'FAQs'
      const processEntry = navigation.querySelector('a[href="#process"]')
      navigation.insertBefore(link, processEntry?.nextSibling || null)
    }
  }

  function renderTestimonials(items) {
    const pricing = document.getElementById('pricing')
    if (!pricing) return
    let section = document.getElementById('testimonials')
    if (!section) {
      section = document.createElement('section')
      section.className = 'testimonials'
      section.id = 'testimonials'
      section.setAttribute('aria-labelledby', 'testimonialHeading')
      section.innerHTML = '<div class="wrap"><div class="testimonialHeading"><div><div class="eyebrow">CLIENT EXPERIENCES</div><h2 id="testimonialHeading">Words from the people<br><span class="grad">we build with.</span></h2></div><p>Real feedback from customers who have worked with Brew EdgeTech.</p></div><div class="testimonialGrid" role="list" aria-label="Customer testimonials"></div></div>'
      pricing.before(section)
      const nav = document.querySelector('.links')
      if (nav && !nav.querySelector('a[href="#testimonials"]')) {
        const link = document.createElement('a')
        link.href = '#testimonials'
        link.textContent = 'Testimonials'
        const pricingLink = nav.querySelector('a[href="#pricing"]')
        nav.insertBefore(link, pricingLink || null)
      }
    }
    const visible = Array.isArray(items)
      ? items.filter((item) => item && typeof item.name === 'string' && item.name.trim() &&
        typeof item.quote === 'string' && item.quote.trim())
      : []
    const track = section.querySelector('.testimonialGrid')
    track.replaceChildren(...visible.map((item) => {
      const card = document.createElement('article')
      card.className = 'testimonialCard'
      card.setAttribute('role', 'listitem')
      const quoteMark = document.createElement('span')
      quoteMark.className = 'testimonialQuoteMark'
      quoteMark.setAttribute('aria-hidden', 'true')
      quoteMark.textContent = '“'
      const quote = document.createElement('blockquote')
      quote.textContent = item.quote.trim()
      const attribution = document.createElement('div')
      attribution.className = 'testimonialAttribution'
      const initials = item.name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase()
      const avatar = document.createElement('span')
      avatar.className = 'testimonialAvatar'
      avatar.setAttribute('aria-hidden', 'true')
      avatar.textContent = initials
      const identity = document.createElement('span')
      identity.className = 'testimonialIdentity'
      const name = document.createElement('strong')
      name.textContent = item.name.trim()
      identity.appendChild(name)
      if (typeof item.role === 'string' && item.role.trim()) {
        const byline = document.createElement('span')
        byline.className = 'testimonialRole'
        byline.textContent = item.role.trim()
        identity.appendChild(byline)
      }
      attribution.append(avatar, identity)
      card.append(quoteMark, quote, attribution)
      return card
    }))
    section.hidden = visible.length === 0
    const testimonialLink = document.querySelector('.links a[href="#testimonials"]')
    if (testimonialLink) testimonialLink.hidden = section.hidden
  }

  function renderFaq(items = []) {
    const list = document.querySelector('.faqgrid>div:last-child')
    if (!list) return

    list.replaceChildren(...(Array.isArray(items) ? items : [])
      .filter((item) => item && typeof item.question === 'string' && item.question.trim())
      .slice(0, 20)
      .map((item) => {
        const detail = document.createElement('details')
        const question = document.createElement('summary')
        question.textContent = item.question
        const answer = document.createElement('p')
        answer.textContent = typeof item.answer === 'string' ? item.answer : ''
        detail.append(question, answer)
        return detail
      }))
  }

  function applyVisibility(visibility = {}) {
    const main = document.getElementById('main-content')
    const allowed = new Set(sectionDefinitions.map(([selector]) => selector))
    for (const [selector, label] of sectionDefinitions) {
      if (selector === '#testimonials') continue
      const legacy = legacySelectors[selector] || []
      const legacyValue = legacy.find((key) => typeof visibility[key] === 'boolean')
      const shown = typeof visibility[selector] === 'boolean'
        ? visibility[selector]
        : legacyValue ? visibility[legacyValue] : true
      const elements = selector === 'footer'
        ? [document.querySelector('footer')]
        : [...document.querySelectorAll(selector)]
      if (legacy.length && selector !== '#testimonials') {
        legacy.forEach((legacySelector) => document.querySelectorAll(legacySelector).forEach((element) => {
          element.hidden = !shown
        }))
      }
      for (const element of elements) {
        if (!element) continue
        if (selector === '#services' && main) {
          const merged = main.querySelector('.capabilitiesMerged')
          if (merged) merged.hidden = !shown
        }
        element.hidden = !shown
      }
      const navTarget = selector.startsWith('#') ? selector : null
      if (navTarget) {
        document.querySelectorAll(`a[href="${navTarget}"]`).forEach((link) => {
          link.hidden = !shown
        })
      }
    }
    const testimonial = document.getElementById('testimonials')
    if (testimonial && allowed.has('#testimonials') && visibility['#testimonials'] === false) {
      testimonial.hidden = true
    }
    const testimonialLink = document.querySelector('.links a[href="#testimonials"]')
    if (testimonialLink) testimonialLink.hidden = !testimonial || testimonial.hidden
  }

  function safePublicLink(value) {
    if (typeof value !== 'string' || !value.trim()) return null
    const link = value.trim()
    if (link.startsWith('/') && !link.startsWith('//')) return link
    try {
      const url = new URL(link)
      return url.protocol === 'https:' && !url.username && !url.password ? url.href : null
    } catch {
      return null
    }
  }

  function renderServices(items = []) {
    const grid = document.querySelector('#services .servicegrid')
    if (!grid) return

    const defaultServices = [
      {
        title: 'Web Design & Development',
        description: 'Responsive, accessible websites with a distinctive identity and a smooth experience on every screen.',
        url: '/services/website-design/',
      },
      {
        title: 'Custom Software',
        description: 'Purpose-built web applications, dashboards and workflows that fit how your team works.',
        url: '/services/custom-software/',
      },
      {
        title: 'AI & Automation',
        description: 'Practical AI integrations and automated workflows that reduce repetitive work while keeping people in control.',
        url: '/services/ai-automation/',
      },
      {
        title: 'SEO & Digital Visibility',
        description: 'Search-friendly site structure and clear content that help customers discover your business.',
        url: '/services/seo-visibility/',
      },
    ]
    const icons = ['⌘', '▱', '✧', '⌕']
    const configuredServices = (Array.isArray(items) ? items : [])
      .filter((service) => service && typeof service.title === 'string' && service.title.trim())
      .slice(0, 20)
      .map((service, index) => {
        const card = document.createElement('a')
        card.className = 'service reveal show'
        card.href = safePublicLink(service?.url) || '#contact'

        const icon = document.createElement('div')
        icon.className = 'ico'
        icon.textContent = icons[index % icons.length]
        const arrow = document.createElement('em')
        arrow.textContent = '↗'
        const title = document.createElement('h3')
        title.textContent = typeof service?.title === 'string' ? service.title : ''
        const description = document.createElement('p')
        description.textContent = typeof service?.description === 'string' ? service.description : ''
        card.append(icon, arrow, title, description)
        return card
      })
    const cards = configuredServices.length
      ? configuredServices
      : grid.children.length
        ? null
        : defaultServices.map((service, index) => {
            const card = document.createElement('a')
            card.className = 'service reveal show'
            card.href = service.url
            const icon = document.createElement('div')
            icon.className = 'ico'
            icon.textContent = icons[index]
            const arrow = document.createElement('em')
            arrow.textContent = '↗'
            const title = document.createElement('h3')
            title.textContent = service.title
            const description = document.createElement('p')
            description.textContent = service.description
            card.append(icon, arrow, title, description)
            return card
          })
    if (cards) grid.replaceChildren(...cards)
  }

  function renderPricing(items = []) {
    const grid = document.querySelector('#pricing .priceGrid')
    if (!grid) return

    const cards = (Array.isArray(items) ? items : [])
      .filter((item) => item && typeof item.title === 'string' && item.title.trim())
      .slice(0, 12)
      .map((item, index) => {
        const card = document.createElement('article')
        card.className = 'priceCard'
        if (index === 1) card.classList.add('featured')

        const tag = document.createElement('span')
        tag.className = 'priceTag'
        tag.textContent = typeof item?.tag === 'string' && item.tag.trim() ? item.tag.trim() : 'PACKAGE'
        const title = document.createElement('h3')
        title.textContent = typeof item?.title === 'string' ? item.title : ''
        const price = document.createElement('p')
        price.className = 'price'
        price.textContent = typeof item?.price === 'string' && item.price.trim() ? item.price.trim() : 'Custom quote'
        const description = document.createElement('p')
        description.className = 'priceDesc'
        description.textContent = typeof item?.description === 'string' ? item.description : ''
        const features = document.createElement('ul')
        features.replaceChildren(...(Array.isArray(item?.features) ? item.features : [])
          .slice(0, 12)
          .map((feature) => {
            const entry = document.createElement('li')
            entry.textContent = String(feature)
            return entry
          }))
        const action = document.createElement('a')
        action.className = index === 1 ? 'btn' : 'btn alt'
        action.href = '#contact'
        action.textContent = 'Discuss your project ↗'
        card.append(tag, title, price, description, features, action)
        return card
      })
    grid.replaceChildren(...cards)
  }

  function applyMobileExperience(config = {}) {
    const controls = document.querySelectorAll('#mobile-experience .deviceChoice')
    controls.forEach((button) => {
      button.disabled = config.enabled === false
    })

    const devices = {
      desktop: '.responsiveDesktop',
      tablet: '.responsiveTablet',
      phone: '.responsivePhone',
    }
    for (const [device, selector] of Object.entries(devices)) {
      const settings = config[device]
      const frameUrl = safePublicLink(settings?.url)
      const mockup = document.querySelector(`${selector} .dummySite`)
      if (!frameUrl || !mockup) continue

      const frame = document.createElement('iframe')
      frame.className = 'siteDemoFrame'
      frame.src = frameUrl
      frame.title = typeof settings.title === 'string' && settings.title.trim()
        ? settings.title.trim()
        : `${device} website preview`
      frame.loading = 'lazy'
      frame.referrerPolicy = 'no-referrer'
      mockup.replaceWith(frame)
    }
  }

  document.addEventListener('error', (event) => {
    const image = event.target
    if (!(image instanceof HTMLImageElement) || !image.matches('.caseVisual > img')) return

    const visual = image.parentElement
    if (!visual) return

    const placeholder = document.createElement('div')
    placeholder.className = 'portfolioProjectVisual'
    placeholder.textContent = visual.querySelector('.caseBadge')?.textContent?.trim().toUpperCase()
      || 'PROJECT PREVIEW UNAVAILABLE'
    image.replaceWith(placeholder)
  }, true)

  function createPortfolioCard(project) {
    const card = document.createElement('article')
    card.className = 'caseCard'
    card.dataset.portfolioId = String(project.id)

    const visual = document.createElement('div')
    visual.className = 'caseVisual'
    const imageUrl = safePublicLink(project.image_url)
    if (imageUrl) {
      const image = document.createElement('img')
      image.src = imageUrl
      image.alt = project.title ? `${project.title} project` : 'Portfolio project'
      image.loading = 'lazy'
      visual.appendChild(image)
    } else {
      const placeholder = document.createElement('div')
      placeholder.className = 'portfolioProjectVisual'
      placeholder.textContent = String(project.category || 'SELECTED PROJECT').toUpperCase()
      visual.appendChild(placeholder)
    }

    const badge = document.createElement('span')
    badge.className = 'caseBadge'
    badge.textContent = String(project.category || 'SELECTED WORK')
    visual.appendChild(badge)

    const copy = document.createElement('div')
    copy.className = 'caseCopy'
    const category = document.createElement('span')
    category.className = 'caseType'
    category.textContent = String(project.category || 'PROJECT')
    const title = document.createElement('h3')
    title.textContent = String(project.title || 'Selected project')
    copy.append(category, title)

    if (typeof project.description === 'string' && project.description.trim()) {
      const description = document.createElement('p')
      description.textContent = project.description.trim()
      copy.appendChild(description)
    }
    if (typeof project.technologies === 'string' && project.technologies.trim()) {
      const technologies = document.createElement('p')
      technologies.textContent = project.technologies.trim()
      copy.appendChild(technologies)
    }

    const link = safePublicLink(project.live_url) || safePublicLink(project.demo_url)
    if (link) {
      const action = document.createElement('a')
      action.className = 'btn alt'
      action.href = link
      action.textContent = project.live_url ? 'View live project ↗' : 'View demo ↗'
      if (/^https:\/\//i.test(link)) {
        action.target = '_blank'
        action.rel = 'noopener noreferrer'
      }
      copy.appendChild(action)
    }

    card.append(visual, copy)
    return card
  }

  function syncPortfolioProjects(grid, projects) {
    const existing = new Set(
      [...grid.querySelectorAll('[data-portfolio-id]')].map((card) => card.dataset.portfolioId),
    )
    for (const project of projects) {
      const id = String(project.id || '')
      if (!id || existing.has(id)) continue
      grid.appendChild(createPortfolioCard(project))
      existing.add(id)
    }
  }

  function renderFallbackConcepts(grid) {
    if (grid.children.length) return

    const concepts = [
      {
        id: 'concept-finance-workspace',
        category: 'ILLUSTRATIVE CONCEPT · SAMPLE DATA',
        title: 'A clearer finance workspace',
        description: 'Bring spending, receipts and vendor payments into one considered business dashboard.',
      },
      {
        id: 'concept-operations-dashboard',
        category: 'ILLUSTRATIVE CONCEPT · SAMPLE DATA',
        title: 'Operations at a glance',
        description: 'Explore how bookings, trips and collections could come together in a purpose-built workflow.',
      },
      {
        id: 'concept-trading-tools',
        category: 'ILLUSTRATIVE CONCEPT · SAMPLE DATA',
        title: 'A focused trading workspace',
        description: 'A concept for bringing market context, positions and risk tools into one interface.',
      },
    ]

    grid.replaceChildren(...concepts.map(createPortfolioCard))
  }

  async function loadPortfolioProjects() {
    const grid = document.querySelector('.caseGrid')
    if (!grid) return
    const response = await fetch('/api/portfolio')
    if (!response.ok) throw new Error(`Portfolio request failed (${response.status})`)
    const { projects = [] } = await response.json()
    if (!Array.isArray(projects) || !projects.length) {
      renderFallbackConcepts(grid)
      return
    }

    syncPortfolioProjects(grid, projects)
    const observer = new MutationObserver(() => syncPortfolioProjects(grid, projects))
    observer.observe(grid, { childList: true })
  }

  window.getPublishedSiteContent()
    .then((content) => {
      prepareFaqNavigation()
      renderTestimonials(content.testimonials?.items)
      renderServices(content.services?.items)
      renderPricing(content.pricing?.items)
      renderFaq(content.faq?.items)
      applyMobileExperience(content.mobile_experience || {})
      applyVisibility(content.homepage?.section_visibility || {})
    })
    .catch((error) => console.error('Could not load website sections:', error))

  loadPortfolioProjects()
    .catch((error) => {
      console.error('Could not load published portfolio projects:', error)
      const grid = document.querySelector('.caseGrid')
      if (grid) renderFallbackConcepts(grid)
    })
})()
