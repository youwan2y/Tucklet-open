import Image from "next/image";
import { SiteIcon } from "./SiteIcon";

const repositoryHref = "https://github.com/youwan2y/Tucklet-open";
const screenshots = [
  {
    src: "/screenshots/tucklet-agent.jpg",
    width: 3840,
    height: 2100,
    alt: "Tucklet 的 macOS 桌面窗口。左侧笔记库选中了 Agent 新建的执行清单，中间显示清单正文，右侧显示 Agent 的保存结果。",
    caption: "Agent 写回的执行清单",
  },
];

function Brand() {
  return (
    <a className="site-brand" href="#top" aria-label="Tucklet 首页">
      <Image src="/tucklet-mark.svg" alt="" width={32} height={32} />
      <span>Tucklet</span>
    </a>
  );
}

export function LandingPage() {
  return (
    <>
      <a href="#main" className="site-skip-link">跳到正文</a>
      <header id="top" className="site-header">
        <div className="site-shell site-header-inner">
          <Brand />
          <nav className="site-nav" aria-label="官网导航">
            <a href="#product">产品截图</a>
            <a href="/playground">组件演示</a>
          </nav>
          <a className="site-button site-button-small" href={repositoryHref}>
            查看源码 <SiteIcon name="up-right" />
          </a>
        </div>
      </header>

      <main id="main" tabIndex={-1}>
        <section className="site-hero" aria-labelledby="hero-title">
          <div className="site-shell">
            <div className="hero-intro">
              <h1 id="hero-title">把笔记<span>用起来</span>。</h1>
              <p className="hero-description">你的个人知识管理 Agent。用自己的笔记找答案、整理资料、记下待办。</p>
              <div className="hero-actions">
                <a className="site-button" href="#product">
                  看看产品 <SiteIcon name="down" />
                </a>
              </div>
            </div>
            <section id="product" className="product-screenshots" aria-label="macOS 产品实拍">
              <figure className="product-shot">
                <a href="/screenshots/tucklet-agent-run.gif" className="product-shot-link" aria-label="查看 Agent 执行流程动图">
                  <picture>
                    <source media="(prefers-reduced-motion: reduce)" srcSet="/screenshots/tucklet-agent.jpg" />
                    <Image
                      src="/screenshots/tucklet-agent-run.gif"
                      alt="Tucklet Agent 实录。读取筹备笔记和参观访谈，整理到场风险与待办，新建执行清单并打开结果。"
                      width={1440}
                      height={788}
                      loading="eager"
                      fetchPriority="high"
                      unoptimized
                    />
                  </picture>
                </a>
                <figcaption>Agent 从两篇笔记整理出一份执行清单，并存回笔记库。</figcaption>
              </figure>
              {screenshots.map(({ src, width, height, alt, caption }) => (
                <figure key={src} className="product-shot">
                  <a href={src} className="product-shot-link" aria-label={`查看${caption}原图`}>
                    <Image src={src} alt={alt} width={width} height={height} unoptimized />
                  </a>
                  <figcaption>{caption} <span aria-hidden="true">·</span> macOS 实拍</figcaption>
                </figure>
              ))}
            </section>
          </div>
        </section>

        <section id="get-tucklet" className="site-cta" aria-labelledby="trial-heading">
          <div className="site-shell site-cta-inner">
            <h2 id="trial-heading">从产品体验，走到交互实现。</h2>
            <a className="site-button" href="/playground">
              体验开源组件 <SiteIcon name="up-right" />
            </a>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="site-shell site-footer-inner">
          <Brand />
          <a className="site-text-link" href={repositoryHref}>GitHub <SiteIcon name="up-right" /></a>
        </div>
      </footer>
    </>
  );
}
