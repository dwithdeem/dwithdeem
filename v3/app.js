/* ==========================================
   d.withdeem - Web App Interactions 2026
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initSmoothScroll();
  initInvestClubToggle();
  initFAQAccordion();
  initFilterTabs();
  initStatsCounter();
  initToastAlerts();
  initScrollReveal();
  initFlowSandbox();
  initDashboardModal();
});

/* --- Mobile Menu Drawer Toggle --- */
function initMobileMenu() {
  const burger = document.querySelector('.burger-menu');
  const menu = document.querySelector('.nav-menu');
  const menuLinks = document.querySelectorAll('.nav-menu a');

  if (!burger || !menu) return;

  burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    menu.classList.toggle('active');
  });

  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('active');
      menu.classList.remove('active');
    });
  });
}

/* --- Smooth Scrolling for Anchors --- */
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');
  
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        
        // Offset for the sticky nav bar
        const navHeight = 80;
        const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* --- InvestClub Subscription Toggle --- */
function initInvestClubToggle() {
  const btnMonthly = document.getElementById('toggle-monthly');
  const btnAnnual = document.getElementById('toggle-annual');
  const priceDisplay = document.getElementById('investclub-price');
  const billingPeriod = document.getElementById('investclub-period');
  const savingsNotice = document.getElementById('investclub-savings');
  const checkoutBtn = document.getElementById('investclub-checkout');

  if (!btnMonthly || !btnAnnual || !priceDisplay || !billingPeriod || !checkoutBtn) return;

  btnMonthly.addEventListener('click', () => {
    btnMonthly.classList.add('active');
    btnAnnual.classList.remove('active');
    priceDisplay.textContent = '99 ฿';
    billingPeriod.textContent = '/เดือน';
    if (savingsNotice) {
      savingsNotice.style.opacity = '0';
      savingsNotice.style.transform = 'translateY(5px)';
    }
    checkoutBtn.href = 'https://buy.stripe.com/28EeV67DKcNU2HcgyxcfK08';
  });

  btnAnnual.addEventListener('click', () => {
    btnAnnual.classList.add('active');
    btnMonthly.classList.remove('active');
    priceDisplay.textContent = '990 ฿';
    billingPeriod.textContent = '/ปี';
    if (savingsNotice) {
      savingsNotice.style.opacity = '1';
      savingsNotice.style.transform = 'translateY(0)';
    }
    checkoutBtn.href = 'https://buy.stripe.com/3cI6oA6zG8xEchM5TTcfK0d';
  });
}

/* --- FAQ Accordion --- */
function initFAQAccordion() {
  const items = document.querySelectorAll('.accordion-item');
  
  items.forEach(item => {
    const header = item.querySelector('.accordion-header');
    const content = item.querySelector('.accordion-content');

    if (!header || !content) return;

    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other accordion items
      items.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherContent = otherItem.querySelector('.accordion-content');
          if (otherContent) otherContent.style.maxHeight = null;
        }
      });

      // Toggle current accordion item
      if (isActive) {
        item.classList.remove('active');
        content.style.maxHeight = null;
      } else {
        item.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });
}

/* --- Product Filter Tabs --- */
function initFilterTabs() {
  const tabs = document.querySelectorAll('.filter-tab');
  const groups = document.querySelectorAll('.product-group');
  
  if (!tabs.length || !groups.length) return;
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Update active tab
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      const filter = tab.getAttribute('data-filter');
      
      groups.forEach(group => {
        if (filter === 'all' || group.getAttribute('data-group') === filter) {
          group.classList.remove('hidden');
          group.classList.add('fade-in');
          // Remove animation class after it completes
          setTimeout(() => group.classList.remove('fade-in'), 400);
        } else {
          group.classList.add('hidden');
          group.classList.remove('fade-in');
        }
      });
    });
  });
}

/* --- Scroll Stats Count Up Animation --- */
function initStatsCounter() {
  const statsBar = document.querySelector('.stats-bar');
  const statNumbers = document.querySelectorAll('.stat-number');

  if (!statsBar || statNumbers.length === 0) return;

  const options = {
    root: null,
    threshold: 0.5
  };

  let animated = false;

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        statNumbers.forEach(stat => {
          const rawTarget = stat.getAttribute('data-target');
          if (rawTarget.includes('-')) {
            animateRange(stat, 5, 9, 1500);
          } else {
            const target = parseInt(rawTarget.replace('+', ''), 10);
            animateSingleNumber(stat, target, rawTarget.includes('+'), 2000);
          }
        });
        observer.unobserve(statsBar);
      }
    });
  }, options);

  observer.observe(statsBar);
}

function animateSingleNumber(element, target, appendPlus, duration) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const currentValue = Math.floor(progress * target);
    element.textContent = currentValue + (appendPlus ? '+' : '');
    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      element.textContent = target + (appendPlus ? '+' : '');
    }
  };
  window.requestAnimationFrame(step);
}

function animateRange(element, start, end, duration) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const currentStart = Math.min(start, Math.floor(progress * start));
    const currentEnd = Math.floor(progress * (end - start)) + start;
    element.textContent = `${currentStart}-${currentEnd}`;
    
    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      element.textContent = `${start}-${end}`;
    }
  };
  window.requestAnimationFrame(step);
}

/* --- Toast Alerts for Placeholders and Disabled states --- */
function initToastAlerts() {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-message');
  
  if (!toast || !toastMsg) return;

  window.showToast = function(message) {
    toastMsg.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4000);
  };

  // Add event listeners to any empty or action-required anchors/buttons
  document.querySelectorAll('a, button').forEach(el => {
    const href = el.getAttribute('href');
    
    if (href === '#' && !el.classList.contains('accordion-header') && !el.classList.contains('burger-menu') && !el.classList.contains('dca-details-trigger') && !el.classList.contains('filter-tab')) {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        window.showToast('📍 ฟังก์ชันนี้เป็นจุดเชื่อมต่อการจอง/สั่งซื้อจริง ซึ่งจะพร้อมให้บริการเร็วๆ นี้!');
      });
    }
    
    if (el.classList.contains('btn-disabled')) {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        window.showToast('📈 PortfolioOS กำลังอยู่ระหว่างการทดสอบระบบ จะแจ้งเตือนทันทีที่เปิดตัว!');
      });
    }
  });

  // Custom trigger for DCA details
  document.querySelectorAll('.dca-details-trigger').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      window.showToast('📊 DCA PlanOS: มาพร้อมระบบคำนวณเป้าหมาย, แดชบอร์ดติดตามพอร์ต และกราฟ TradingView ในตัว!');
    });
  });
}

/* --- Scroll Reveal Animation --- */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observerOptions = {
    root: null,
    threshold: 0.05,
    rootMargin: '0px 0px -40px 0px'
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  elements.forEach(el => observer.observe(el));
}

/* --- Flow Automation Sandbox Interactions --- */
function initFlowSandbox() {
  const stepCards = document.querySelectorAll('.flow-step-card');
  const detailNumber = document.getElementById('detail-number');
  const detailTitle = document.getElementById('detail-title');
  const detailDesc = document.getElementById('detail-desc');
  const techContainer = document.querySelector('.flow-detail-tech');

  if (!stepCards.length || !detailNumber || !detailTitle || !detailDesc || !techContainer) return;

  const stepDetails = {
    1: {
      number: 'STEP 1',
      title: 'ลูกค้าชำระเงินผ่านระบบ',
      desc: 'เมื่อลูกค้าคลิกสั่งซื้อสินค้าบนเว็บไซต์หรือหน้า Landing Page ของคุณ ระบบจะพาไปยังหน้า Checkout ที่ปลอดภัยของ Stripe ลูกค้าสามารถเลือกชำระผ่านบัตรเครดิต/เดบิต หรือสแกน QR Code PromptPay ได้โดยตรงอย่างสะดวกสบายและรวดเร็ว',
      tech: ['Stripe Checkout', 'PromptPay API', 'Framer']
    },
    2: {
      number: 'STEP 2',
      title: 'ส่งอีเมลยืนยันทันที',
      desc: 'ทันทีหลังชำระเงินเรียบร้อย ระบบจะสั่งการส่งเมลยืนยันการซื้อขาย (Confirmation Email) ไปยังกล่องจดหมายของลูกค้าแบบอัตโนมัติ เพื่อยืนยันว่าการชำระเงินเสร็จสิ้นและเตรียมจัดส่งสินค้า',
      tech: ['Gmail SMTP', 'Make / Pably', 'Stripe Webhooks']
    },
    3: {
      number: 'STEP 3',
      title: 'ลูกค้าได้รับสินค้าทันที',
      desc: 'ลูกค้าสามารถดาวน์โหลดสินค้า เช่น ไฟล์ E-Book, ลิงก์ Notion Template หรือวิดีโอคู่มือได้ทันทีจากหน้าความสำเร็จในการสั่งซื้อและทางอีเมลที่จัดส่งให้แบบอัตโนมัติ ไม่ต้องรอให้แอดมินมาตอบแชทหรือกดส่งมือ',
      tech: ['Notion API', 'Make Automation', 'Gmail SMTP']
    },
    4: {
      number: 'STEP 4',
      title: 'บันทึกข้อมูลเข้า Notion CRM',
      desc: 'ในเวลาเดียวกัน รายละเอียดของลูกค้า (ชื่อ อีเมล เบอร์โทรศัพท์ ยอดชำระ และชื่อสินค้าที่สั่งซื้อ) จะถูกบันทึกลงในฐานข้อมูล Notion CRM ของคุณโดยอัตโนมัติ เพื่อความง่ายในการเก็บประวัติและติดตามข้อมูล',
      tech: ['Notion CRM Database', 'Make.com', 'Stripe Billing']
    },
    5: {
      number: 'STEP 5',
      title: 'ติดตามและดูแลต่อเนื่อง',
      desc: 'ระบบจะช่วยส่งอีเมลทักทายติดตามความคืบหน้า หรือให้คำปรึกษาเพิ่มเติมหลังจากนั้น 3-7 วัน เพื่อสร้างความสัมพันธ์ที่ดี (Nurturing) และนำเสนอสินค้าชิ้นถัดไปของคุณโดยอิงจากประวัติการซื้อ',
      tech: ['Email Automation', 'MailerLite / Mailchimp', 'Notion CRM']
    }
  };

  stepCards.forEach(card => {
    card.addEventListener('click', () => {
      // Remove active from all cards
      stepCards.forEach(c => c.classList.remove('active'));
      // Add active to clicked card
      card.classList.add('active');

      const step = card.getAttribute('data-step');
      const data = stepDetails[step];

      if (data) {
        detailNumber.textContent = data.number;
        detailTitle.textContent = data.title;
        detailDesc.textContent = data.desc;

        // Render tech tags
        techContainer.innerHTML = '<span>เครื่องมือที่ใช้หลังบ้าน:</span>';
        data.tech.forEach(t => {
          const tag = document.createElement('span');
          tag.className = 'tech-tag';
          tag.textContent = t;
          techContainer.appendChild(tag);
        });
      }
    });
  });
}

/* --- Dashboard Preview Modal Interactions --- */
let activeModal = null;

function initDashboardModal() {
  const triggers = document.querySelectorAll('.dashboard-link-item');
  const modal = document.getElementById('dashboard-modal');
  
  if (!triggers.length || !modal) return;

  activeModal = modal;

  const dashboardData = {
    content: {
      title: 'Content Dashboard',
      subtitle: 'จัดการไอเดียคอนเทนต์ โครงสร้างช่อง และตารางการลงโพสต์ในที่เดียว',
      image: 'img/SoloBrandOS.png',
      features: [
        'ระบบจัดเก็บไอเดียแยกสถานะ (Idea Inbox)',
        'ปฏิทินตารางการเผยแพร่ (Content Calendar)',
        'โครงสร้างวิเคราะห์แชนเนลแต่ละช่องทาง',
        'ระบบจดบันทึกบทพูด (Script Templates)',
        'ตัวคัดกรองจัดลำดับความสำคัญของคอนเทนต์'
      ]
    },
    customer: {
      title: 'Customer Dashboard',
      subtitle: 'แดชบอร์ดเก็บประวัติลูกค้า ความชอบ และยอดใช้จ่ายสะสมเพื่อความสัมพันธ์ที่ดี',
      image: 'img/FinanceOS.png',
      features: [
        'ฐานข้อมูลจัดเก็บรายละเอียดรายชื่อลูกค้าเดี่ยว',
        'ตัวกรองตรวจสอบสถานะลูกค้า (Active/Inactive)',
        'ระบบบันทึกปัญหาย้อนหลังและการพูดคุย',
        'ระบบแท็กความคุ้มค่า/ยอดใช้จ่ายสะสม',
        'ระบบบันทึกความต้องการสินค้าชิ้นใหม่ของลูกค้า'
      ]
    },
    product: {
      title: 'Product Dashboard',
      subtitle: 'จัดการคลังสินค้าดิจิทัล ลิงก์ดาวน์โหลด และตรวจสอบสถานะสินค้าแต่ละรายการ',
      image: 'img/DCAPLANOS.png',
      features: [
        'ตัวจัดการประวัติสินค้าดิจิทัลในคลัง',
        'ระบบจัดเก็บลิงก์ดาวน์โหลดสำรองอย่างปลอดภัย',
        'หน้าต่างพรีวิว Landing Page ของสินค้าแต่ละชิ้น',
        'ระบบบันทึกยอดดาวน์โหลดและสินค้าขายดี',
        'ตัวแจ้งเตือนการอัพเดทข้อมูลสินค้าส่งลูกค้า'
      ]
    },
    order: {
      title: 'Order Dashboard',
      subtitle: 'บันทึกยอดขาย รายการสั่งซื้อ และรายได้สะสมแยกตามช่องทางอัตโนมัติ',
      image: 'img/DCAPLANOS.png',
      features: [
        'สรุปข้อมูลคำสั่งซื้อแบบ Real-time',
        'ระบบคำนวณยอดขายสะสมสุทธิ',
        'กราฟสรุปสินค้าที่สร้างรายได้สูงสุด',
        'ระบบค้นหาและฟิลเตอร์ออเดอร์ตามช่วงวัน',
        'ตัวกรองแยกยอดขาย Stripe และพร้อมเพย์'
      ]
    },
    lead: {
      title: 'Lead Tracker',
      subtitle: 'ระบบวิเคราะห์ความสนใจของว่าที่ลูกค้า ก่อนเข้าสู่กระบวนการปิดการขาย',
      image: 'img/WithDeemAgent.png',
      features: [
        'อินบ็อกซ์เก็บรายชื่อผู้สนใจ (Lead Inbox)',
        'คะแนนระบุความน่าจะเป็น (Lead Scoring)',
        'ประวัติบันทึกการพูดคุยใน Consult & Direction Session',
        'การวิเคราะห์ Conversion Rate แต่ละช่องทาง',
        'ระบบแจ้งเตือนการโทรกลับเพื่อเสนอโปรโมชั่น'
      ]
    }
  };

  triggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const type = trigger.getAttribute('data-preview');
      const data = dashboardData[type];

      if (data) {
        document.getElementById('modal-title').textContent = data.title;
        document.getElementById('modal-subtitle').textContent = data.subtitle;
        
        const img = document.getElementById('modal-image');
        img.src = data.image;
        img.alt = data.title;

        // Render features
        const list = document.getElementById('modal-features');
        list.innerHTML = '';
        data.features.forEach(f => {
          const li = document.createElement('li');
          li.style.display = 'flex';
          li.style.gap = '8px';
          li.style.alignItems = 'center';
          li.innerHTML = `<i class="fa-solid fa-circle-check color-green" style="font-size: 0.8rem; margin-top: 3px;"></i> <span>${f}</span>`;
          list.appendChild(li);
        });

        // Show modal
        modal.classList.add('show');
      }
    });
  });
}

function closeDashboardModal() {
  if (activeModal) {
    activeModal.classList.remove('show');
  }
}

// Click outside to close
window.addEventListener('click', (e) => {
  const modal = document.getElementById('dashboard-modal');
  if (e.target === modal) {
    closeDashboardModal();
  }
});

