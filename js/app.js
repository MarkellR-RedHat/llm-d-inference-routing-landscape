(function () {
  'use strict';

  /* ══════════════════════════════════════════════════════════
     CONFIG — All data inlined
     ══════════════════════════════════════════════════════════ */
  var CONFIG = {
    STACKS: [
      {
        key: 'basic',
        name: 'Basic Stack',
        tagline: 'Runtime behind a round-robin load balancer. Each pod has local prefix caching, but routing is random — most requests miss the warm cache.',
        color: '#e53e3e',
        cssClass: 'basic',
        layers: [
          { name: 'vLLM or SGLang', type: 'runtime' },
          { name: 'Round-Robin LB', type: 'routing' }
        ],
        pills: ['Round-Robin', 'Local Cache Only', 'Any Infrastructure']
      },
      {
        key: 'platform',
        name: 'Platform Stack',
        tagline: 'Adds KServe and Gateway API for Kubernetes-native deployment, autoscaling, and traffic management. Routing is still load-balanced — no cache awareness.',
        color: '#2b6cb0',
        cssClass: 'platform',
        layers: [
          { name: 'vLLM or SGLang', type: 'runtime' },
          { name: 'KServe', type: 'platform' },
          { name: 'Gateway API', type: 'platform' }
        ],
        pills: ['Gateway API', 'Autoscaling', 'Kubernetes-Native']
      },
      {
        key: 'cacheaware',
        name: 'Cache-Aware Stack',
        tagline: 'Everything in the Platform stack, plus llm-d\'s Endpoint Picker Policy (EPP). Routes requests to pods with warm KV caches — up to 47.5x faster TTFT.',
        color: '#38a169',
        cssClass: 'cacheaware',
        layers: [
          { name: 'vLLM or SGLang', type: 'runtime' },
          { name: 'KServe', type: 'platform' },
          { name: 'Gateway API', type: 'platform' },
          { name: 'llm-d EPP', type: 'routing-smart' }
        ],
        pills: ['KV-Cache Routing', 'Multi-Pod Aware', 'CNCF Sandbox']
      }
    ],

    RUNTIMES: [
      {
        key: 'vllm',
        name: 'vLLM',
        cssClass: 'vllm',
        color: '#c05621',
        description: 'High-throughput inference engine with PagedAttention and continuous batching. The most widely adopted open-source LLM runtime.',
        strengths: ['PagedAttention', 'Continuous Batching', 'Wide Model Support', 'Large Community']
      },
      {
        key: 'sglang',
        name: 'SGLang',
        cssClass: 'sglang',
        color: '#6b46c1',
        description: 'Structured generation runtime with RadixAttention for efficient prefix caching and optimized constrained decoding.',
        strengths: ['RadixAttention', 'Structured Output', 'Constrained Decoding', 'Fast Local Cache']
      }
    ],

    ICONS: {
      basic: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>',
      platform: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12"/></svg>',
      cacheaware: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>'
    },

    MATRIX_CATEGORIES: [
      {
        title: 'Cache Intelligence',
        rows: [
          {
            label: 'Local Prefix Caching (per pod)',
            values: [
              { type: 'check' },
              { type: 'check' },
              { type: 'check' }
            ]
          },
          {
            label: 'Cross-Pod Cache Coordination',
            values: [
              { type: 'cross' },
              { type: 'cross' },
              { type: 'check' }
            ]
          },
          {
            label: 'Cache-Aware Request Routing',
            values: [
              { type: 'cross' },
              { type: 'cross' },
              { type: 'check' }
            ]
          },
          {
            label: 'Real-Time KV Cache Tracking',
            values: [
              { type: 'cross' },
              { type: 'cross' },
              { type: 'check' }
            ]
          },
          {
            label: 'Cold-Start Elimination',
            values: [
              { type: 'cross' },
              { type: 'cross' },
              { type: 'check' }
            ]
          }
        ]
      },
      {
        title: 'Performance',
        rows: [
          {
            label: 'TTFT at 32K (avg with prefix reuse)',
            values: [
              { type: 'value', text: '~3500ms' },
              { type: 'value', text: '~3500ms' },
              { type: 'badge', text: '~84ms', style: 'green' }
            ]
          },
          {
            label: 'TTFT at 32K (lucky same-pod hit)',
            values: [
              { type: 'value', text: '~300ms' },
              { type: 'value', text: '~300ms' },
              { type: 'badge', text: '~84ms', style: 'green' }
            ]
          },
          {
            label: 'Routing Overhead',
            values: [
              { type: 'badge', text: '<1ms', style: 'green' },
              { type: 'value', text: '~5ms' },
              { type: 'value', text: '~2ms' }
            ]
          },
          {
            label: 'Cache Hit Rate (multi-pod)',
            values: [
              { type: 'badge', text: '~1/N', style: 'red' },
              { type: 'badge', text: '~1/N', style: 'red' },
              { type: 'badge', text: '~95%', style: 'green' }
            ]
          }
        ]
      },
      {
        title: 'Kubernetes & Operations',
        rows: [
          {
            label: 'Requires Kubernetes',
            values: [
              { type: 'cross' },
              { type: 'check' },
              { type: 'check' }
            ]
          },
          {
            label: 'KServe',
            values: [
              { type: 'cross' },
              { type: 'check' },
              { type: 'check' }
            ]
          },
          {
            label: 'Gateway API',
            values: [
              { type: 'cross' },
              { type: 'check' },
              { type: 'check' }
            ]
          },
          {
            label: 'Autoscaling',
            values: [
              { type: 'badge', text: 'HPA only', style: '' },
              { type: 'badge', text: 'KPA / HPA', style: 'blue' },
              { type: 'badge', text: 'KPA / HPA', style: 'green' }
            ]
          },
          {
            label: 'Canary / Blue-Green Deploys',
            values: [
              { type: 'cross' },
              { type: 'check' },
              { type: 'check' }
            ]
          },
          {
            label: 'Multi-Model Serving',
            values: [
              { type: 'cross' },
              { type: 'check' },
              { type: 'check' }
            ]
          },
          {
            label: 'Production Readiness',
            values: [
              { type: 'badge', text: 'Minimal', style: 'red' },
              { type: 'badge', text: 'Production', style: 'blue' },
              { type: 'badge', text: 'Production', style: 'green' }
            ]
          }
        ]
      },
      {
        title: 'Workload Suitability',
        rows: [
          {
            label: 'Multi-Turn Chat',
            values: [
              { type: 'dots', filled: 1 },
              { type: 'dots', filled: 1 },
              { type: 'dots', filled: 5 }
            ]
          },
          {
            label: 'Agentic / Tool Calling',
            values: [
              { type: 'dots', filled: 1 },
              { type: 'dots', filled: 1 },
              { type: 'dots', filled: 5 }
            ]
          },
          {
            label: 'RAG / Retrieval',
            values: [
              { type: 'dots', filled: 1 },
              { type: 'dots', filled: 2 },
              { type: 'dots', filled: 5 }
            ]
          },
          {
            label: 'Structured Output',
            values: [
              { type: 'dots', filled: 2 },
              { type: 'dots', filled: 2 },
              { type: 'dots', filled: 4 }
            ]
          },
          {
            label: 'Batch Processing (unique prompts)',
            values: [
              { type: 'dots', filled: 4 },
              { type: 'dots', filled: 3 },
              { type: 'dots', filled: 3 }
            ]
          }
        ]
      },
      {
        title: 'Ecosystem',
        rows: [
          {
            label: 'Open Source',
            values: [
              { type: 'check' },
              { type: 'check' },
              { type: 'check' }
            ]
          },
          {
            label: 'CNCF Project',
            values: [
              { type: 'cross' },
              { type: 'badge', text: 'Incubating', style: 'blue' },
              { type: 'badge', text: 'Sandbox', style: 'green' }
            ]
          },
          {
            label: 'Complexity',
            values: [
              { type: 'badge', text: 'Low', style: 'green' },
              { type: 'badge', text: 'Medium', style: 'blue' },
              { type: 'badge', text: 'Medium', style: 'green' }
            ]
          }
        ]
      }
    ],

    PERF_DATA: {
      contexts: [500, 1000, 2000, 4000, 8000, 16000, 32000],
      stacks: {
        basic:      [85, 170, 340, 680, 1350, 2700, 4000],
        platform:   [90, 175, 350, 700, 1380, 2750, 4000],
        cacheaware: [40, 50, 58, 64, 70, 78, 84]
      }
    },

    SCENARIOS: [
      {
        key: 'chat',
        label: 'Multi-Turn Chat',
        icon: '💬',
        title: 'Multi-Turn Conversations',
        description: 'Shared system prompts and growing conversation history create high prefix overlap across requests.',
        ratings: { basic: 20, platform: 30, cacheaware: 95 },
        best: 'cacheaware',
        why: 'Multi-turn chat has extremely high prefix overlap — every message reuses the system prompt and prior conversation. With round-robin routing (Basic & Platform stacks), follow-up messages land on random pods, missing the cache almost every time. <strong>The Cache-Aware stack</strong> routes each follow-up to the pod that already has that conversation\'s KV cache warm.'
      },
      {
        key: 'agentic',
        label: 'Agentic / Tool Use',
        icon: '🤖',
        title: 'Agentic Workflows',
        description: 'Tool-calling agents with iterative reasoning loops. Each call shares the agent context from prior iterations.',
        ratings: { basic: 15, platform: 25, cacheaware: 95 },
        best: 'cacheaware',
        why: 'Agentic workflows involve rapid-fire LLM calls, each building on the same growing context. Round-robin scatters these across pods, forcing re-prefill every time. <strong>The Cache-Aware stack</strong> keeps the entire chain\'s KV cache warm on one pod, reducing each iteration\'s TTFT by up to 40x at long contexts.'
      },
      {
        key: 'rag',
        label: 'RAG / Retrieval',
        icon: '🔍',
        title: 'Retrieval-Augmented Generation',
        description: 'Shared retrieval template with varying document chunks. The system prompt and template prefix are highly reusable.',
        ratings: { basic: 20, platform: 30, cacheaware: 90 },
        best: 'cacheaware',
        why: 'RAG queries share a common system prompt and retrieval template. The document chunks vary, but the prefix is highly reusable. <strong>The Cache-Aware stack</strong> routes queries with matching prefixes to the same pod, turning a 4-second prefill into sub-100ms. The Platform stack adds better ops but no routing improvement.'
      },
      {
        key: 'code',
        label: 'Code Generation',
        icon: '💻',
        title: 'Code Generation & Completion',
        description: 'IDE-style completions with shared file context across edits. High prefix reuse within editing sessions.',
        ratings: { basic: 25, platform: 35, cacheaware: 85 },
        best: 'cacheaware',
        why: 'Code generation in an IDE reuses the same file context across edits. <strong>The Cache-Aware stack</strong> ensures the file\'s KV cache stays warm on the same pod across edits, making completions near-instant. For structured output (JSON, code templates), both stacks benefit equally from the runtime\'s constrained decoding.'
      },
      {
        key: 'batch',
        label: 'Batch Processing',
        icon: '📦',
        title: 'Batch / Bulk Inference',
        description: 'High-volume processing with unique prompts and minimal prefix overlap between requests.',
        ratings: { basic: 75, platform: 65, cacheaware: 50 },
        best: 'basic',
        why: 'Batch processing with unique prompts has minimal prefix overlap, so cache-aware routing provides little benefit. <strong>The Basic stack\'s</strong> simplicity and low overhead actually wins here — round-robin distributes load evenly, and the runtime\'s continuous batching maximizes per-GPU throughput. No reason to pay for cache-aware routing overhead.'
      }
    ],

    STACK_DETAILS: {
      basic: {
        features: [
          { icon: '⚡', text: 'Simple round-robin distributes requests evenly across pods' },
          { icon: '💾', text: 'Each pod maintains its own local prefix cache (via vLLM/SGLang)' },
          { icon: '🔧', text: 'Works anywhere — bare metal, VMs, or Kubernetes' },
          { icon: '📊', text: 'Minimal operational complexity and routing overhead (<1ms)' }
        ],
        tradeoffs: 'Random routing means most requests miss the warm cache on multi-pod deployments. At 8 pods, only ~12.5% of follow-up requests hit the right cache.',
        bestFor: ['Batch processing', 'Single-pod deployments', 'Non-Kubernetes environments'],
        metrics: { ttft32k: '~3,500ms', cacheHit: '~1/N pods', overhead: '<1ms' }
      },
      platform: {
        features: [
          { icon: '☸️', text: 'KServe provides Kubernetes-native model serving with InferenceService CRD' },
          { icon: '🌐', text: 'Gateway API for standardized traffic management and routing' },
          { icon: '📈', text: 'KPA/HPA autoscaling based on GPU utilization or request concurrency' },
          { icon: '🔄', text: 'Canary and blue-green deployments for safe model rollouts' },
          { icon: '🏗️', text: 'Multi-model serving on shared infrastructure' }
        ],
        tradeoffs: 'Adds Kubernetes dependency and operational complexity. Routing is still load-balanced — no cache awareness across pods.',
        bestFor: ['Production Kubernetes clusters', 'Teams needing autoscaling', 'Multi-model deployments'],
        metrics: { ttft32k: '~3,500ms', cacheHit: '~1/N pods', overhead: '~5ms' }
      },
      cacheaware: {
        features: [
          { icon: '🧠', text: 'llm-d EPP tracks KV cache state across all pods in real time' },
          { icon: '🎯', text: 'Routes requests to the pod with the warmest cache for that prefix' },
          { icon: '⚡', text: 'Eliminates redundant GPU prefill — up to 47.5x faster TTFT at 32K context' },
          { icon: '🔗', text: 'Built on KServe + Gateway API — all Platform stack benefits included' },
          { icon: '🌍', text: 'CNCF Sandbox project with active community governance' },
          { icon: '📡', text: 'Prefix-hash routing with load-aware fallback for optimal distribution' }
        ],
        tradeoffs: 'Requires Kubernetes and the full KServe + Gateway API stack. Best ROI with workloads that have high prefix overlap (chat, agentic, RAG).',
        bestFor: ['Multi-turn chat', 'Agentic workflows', 'RAG pipelines', 'High-volume inference'],
        metrics: { ttft32k: '~84ms', cacheHit: '~95%', overhead: '~2ms' }
      }
    },

    MATRIX_TOOLTIPS: {
      'Local Prefix Caching (per pod)': 'Each runtime (vLLM/SGLang) caches KV tensors for recently-seen prefixes within a single pod. This is automatic — no extra infrastructure needed.',
      'Cross-Pod Cache Coordination': 'Tracking which pods have which prefixes cached, so the router can make informed decisions. Only llm-d EPP does this.',
      'Cache-Aware Request Routing': 'Routing incoming requests to the specific pod that already has the matching prefix in its KV cache, avoiding redundant GPU compute.',
      'Real-Time KV Cache Tracking': 'llm-d EPP continuously monitors the KV cache state of every pod, enabling informed routing decisions even as cache contents change.',
      'Cold-Start Elimination': 'When a pod has the prefix cached, TTFT drops from seconds to milliseconds — the GPU skips prefill entirely and goes straight to generation.',
      'TTFT at 32K (avg with prefix reuse)': 'Average Time to First Token with 32K context length and high prefix overlap. Cache-aware routing eliminates the need to re-prefill the prompt.',
      'TTFT at 32K (lucky same-pod hit)': 'TTFT when a request happens to land on the pod with a warm cache by chance (round-robin) vs. by design (cache-aware).',
      'Routing Overhead': 'Additional latency added by the routing layer itself. All approaches add negligible overhead compared to GPU prefill time.',
      'Cache Hit Rate (multi-pod)': 'Probability of routing a request to a pod with a warm cache. With N pods and round-robin, it\'s 1/N. llm-d EPP achieves ~95% by design.',
      'Requires Kubernetes': 'Whether the stack needs a Kubernetes cluster to run. The Basic stack works on any infrastructure.',
      'KServe': 'KServe provides the InferenceService CRD for Kubernetes-native model deployment, autoscaling, and lifecycle management.',
      'Gateway API': 'Kubernetes Gateway API provides standardized ingress, traffic splitting, and routing rules. Used by both the Platform and Cache-Aware stacks.',
      'Autoscaling': 'HPA = Horizontal Pod Autoscaler (CPU/memory-based). KPA = Knative Pod Autoscaler (concurrency/RPS-based, included with KServe).',
      'Canary / Blue-Green Deploys': 'Gradually rolling out a new model version alongside the existing one, routing a percentage of traffic to validate before full cutover.',
      'Multi-Model Serving': 'Running multiple models on the same infrastructure with shared GPU resources and independent scaling policies.',
      'Production Readiness': 'Overall maturity for production workloads — covering monitoring, reliability, deployment patterns, and operational tooling.',
      'Multi-Turn Chat': 'Conversations where each message reuses the system prompt + prior conversation as a prefix. Very high prefix overlap.',
      'Agentic / Tool Calling': 'LLM agents that make iterative tool calls, each building on the same growing context. Extremely high prefix reuse.',
      'RAG / Retrieval': 'Retrieval-augmented generation with shared system prompts and retrieval templates. High prefix overlap from the template.',
      'Structured Output': 'JSON/code generation with constrained decoding. Benefit comes more from the runtime (SGLang RadixAttention) than the routing layer.',
      'Batch Processing (unique prompts)': 'High-volume processing with unique prompts. Minimal prefix overlap means cache-aware routing provides little benefit.',
      'Open Source': 'All components in every stack are open source with permissive licenses.',
      'CNCF Project': 'Cloud Native Computing Foundation project status. KServe is Incubating; llm-d is Sandbox.',
      'Complexity': 'Operational complexity of deploying and maintaining the stack in production.'
    },

    SCENARIO_METRICS: {
      chat: {
        basic: { ttft: '3,500ms', cacheHit: '12%', throughput: '2.1 req/s/GPU' },
        platform: { ttft: '3,500ms', cacheHit: '12%', throughput: '2.3 req/s/GPU' },
        cacheaware: { ttft: '84ms', cacheHit: '95%', throughput: '8.7 req/s/GPU' }
      },
      agentic: {
        basic: { ttft: '4,000ms', cacheHit: '8%', throughput: '1.5 req/s/GPU' },
        platform: { ttft: '3,800ms', cacheHit: '10%', throughput: '1.8 req/s/GPU' },
        cacheaware: { ttft: '92ms', cacheHit: '93%', throughput: '7.2 req/s/GPU' }
      },
      rag: {
        basic: { ttft: '2,800ms', cacheHit: '15%', throughput: '2.8 req/s/GPU' },
        platform: { ttft: '2,600ms', cacheHit: '18%', throughput: '3.1 req/s/GPU' },
        cacheaware: { ttft: '110ms', cacheHit: '90%', throughput: '7.8 req/s/GPU' }
      },
      code: {
        basic: { ttft: '1,200ms', cacheHit: '20%', throughput: '4.5 req/s/GPU' },
        platform: { ttft: '1,100ms', cacheHit: '22%', throughput: '4.8 req/s/GPU' },
        cacheaware: { ttft: '95ms', cacheHit: '88%', throughput: '8.2 req/s/GPU' }
      },
      batch: {
        basic: { ttft: '1,500ms', cacheHit: '5%', throughput: '6.2 req/s/GPU' },
        platform: { ttft: '1,600ms', cacheHit: '5%', throughput: '5.8 req/s/GPU' },
        cacheaware: { ttft: '1,400ms', cacheHit: '8%', throughput: '5.5 req/s/GPU' }
      }
    },

    DECISION_QUESTIONS: [
      {
        question: 'How much prefix reuse in your workload?',
        options: [
          { label: 'Minimal', key: 'low' },
          { label: 'Moderate', key: 'med' },
          { label: 'High', key: 'high' }
        ]
      },
      {
        question: 'Running on Kubernetes?',
        options: [
          { label: 'Yes', key: 'k8s_yes' },
          { label: 'No', key: 'k8s_no' }
        ]
      },
      {
        question: 'Need autoscaling & canary deploys?',
        options: [
          { label: 'Yes', key: 'auto_yes' },
          { label: 'No', key: 'auto_no' }
        ]
      },
      {
        question: 'Primary workload?',
        options: [
          { label: 'Chat', key: 'chat' },
          { label: 'Agentic', key: 'agentic' },
          { label: 'RAG', key: 'rag' },
          { label: 'Batch', key: 'batch' }
        ]
      }
    ],

    DECISION_WEIGHTS: {
      basic:      { low: 3, med: 0, high: -3, k8s_yes: -1, k8s_no: 3, auto_yes: -2, auto_no: 1, chat: -2, agentic: -2, rag: -2, batch: 3 },
      platform:   { low: 1, med: 1, high: -1, k8s_yes: 3, k8s_no: -3, auto_yes: 3, auto_no: -1, chat: 0, agentic: 0, rag: 0, batch: 1 },
      cacheaware: { low: -2, med: 2, high: 5, k8s_yes: 3, k8s_no: 0, auto_yes: 2, auto_no: 0, chat: 3, agentic: 3, rag: 3, batch: -2 }
    }
  };

  /* ══════════════════════════════════════════════════════════
     STATE
     ══════════════════════════════════════════════════════════ */
  var state = {
    activeStack: null,
    expandedCategories: { 0: true, 1: true, 2: true, 3: true, 4: true },
    activeScenario: 'chat',
    decisionAnswers: {}
  };

  /* ══════════════════════════════════════════════════════════
     UTILITIES
     ══════════════════════════════════════════════════════════ */
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.from((ctx || document).querySelectorAll(sel)); }

  function animateValue(el, end, duration, suffix) {
    suffix = suffix || '';
    var start = 0;
    var startTime = null;
    var isFloat = end % 1 !== 0;
    function step(ts) {
      if (!startTime) startTime = ts;
      var progress = Math.min((ts - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = start + (end - start) * eased;
      el.textContent = (isFloat ? current.toFixed(1) : Math.round(current)) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function getStack(key) {
    return CONFIG.STACKS.find(function (s) { return s.key === key; });
  }

  /* ══════════════════════════════════════════════════════════
     SCROLL PROGRESS
     ══════════════════════════════════════════════════════════ */
  function initScrollProgress() {
    var bar = $('#scrollProgress');
    window.addEventListener('scroll', function () {
      var scrollTop = window.pageYOffset;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (docHeight > 0 ? (scrollTop / docHeight) * 100 : 0) + '%';
    }, { passive: true });
  }

  /* ══════════════════════════════════════════════════════════
     SCROLL REVEAL
     ══════════════════════════════════════════════════════════ */
  function initScrollReveal() {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          var count = entry.target.getAttribute('data-count');
          if (count) {
            var suffix = entry.target.getAttribute('data-suffix') || '';
            animateValue(entry.target, parseFloat(count), 1200, suffix);
          }
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    $$('.reveal').forEach(function (el) { observer.observe(el); });

    $$('.stat-value[data-count]').forEach(function (el) {
      el.classList.add('reveal');
      observer.observe(el);
    });
  }

  /* ══════════════════════════════════════════════════════════
     STACK CARDS
     ══════════════════════════════════════════════════════════ */
  var LAYER_COLORS = {
    runtime: { bg: '#fef3e2', border: '#fcd78e', color: '#92400e' },
    routing: { bg: '#fee2e2', border: '#fca5a5', color: '#991b1b' },
    platform: { bg: '#dbeafe', border: '#93c5fd', color: '#1e40af' },
    'routing-smart': { bg: '#d1fae5', border: '#6ee7b7', color: '#065f46' }
  };

  function renderStackCards() {
    var grid = $('#approachesGrid');
    grid.innerHTML = CONFIG.STACKS.map(function (s, i) {
      var pillsHTML = s.pills.map(function (p) {
        return '<span class="approach-pill">' + p + '</span>';
      }).join('');
      var layersHTML = '<div class="stack-layers">' +
        s.layers.map(function (l) {
          var c = LAYER_COLORS[l.type];
          return '<div class="stack-layer" style="background:' + c.bg + ';border:1px solid ' + c.border + ';color:' + c.color + '">' +
            '<span class="stack-layer-name">' + l.name + '</span>' +
          '</div>';
        }).join('<div class="stack-layer-connector">↕</div>') +
      '</div>';

      var details = CONFIG.STACK_DETAILS[s.key];
      var featuresHTML = details.features.map(function (f) {
        return '<div class="stack-detail-feature"><span class="stack-detail-icon">' + f.icon + '</span><span>' + f.text + '</span></div>';
      }).join('');
      var bestForHTML = details.bestFor.map(function (b) {
        return '<span class="stack-detail-bestfor-tag">' + b + '</span>';
      }).join('');
      var metricsHTML = '<div class="stack-detail-metrics">' +
        '<div class="stack-detail-metric"><div class="stack-detail-metric-value">' + details.metrics.ttft32k + '</div><div class="stack-detail-metric-label">TTFT @ 32K</div></div>' +
        '<div class="stack-detail-metric"><div class="stack-detail-metric-value">' + details.metrics.cacheHit + '</div><div class="stack-detail-metric-label">Cache Hit Rate</div></div>' +
        '<div class="stack-detail-metric"><div class="stack-detail-metric-value">' + details.metrics.overhead + '</div><div class="stack-detail-metric-label">Routing Overhead</div></div>' +
      '</div>';

      var detailsPanel = '<div class="stack-detail-panel" data-detail="' + s.key + '">' +
        metricsHTML +
        '<div class="stack-detail-section"><div class="stack-detail-section-title">What You Get</div>' + featuresHTML + '</div>' +
        '<div class="stack-detail-section"><div class="stack-detail-section-title">Best For</div><div class="stack-detail-bestfor">' + bestForHTML + '</div></div>' +
        '<div class="stack-detail-tradeoffs"><strong>Trade-offs:</strong> ' + details.tradeoffs + '</div>' +
      '</div>';

      return '<div class="approach-card approach-card--' + s.cssClass + ' reveal reveal-delay-' + (i + 1) + '" data-stack="' + s.key + '">' +
        '<div class="approach-icon">' + CONFIG.ICONS[s.key] + '</div>' +
        '<div class="approach-name">' + s.name + '</div>' +
        layersHTML +
        '<div class="approach-tagline">' + s.tagline + '</div>' +
        '<div class="approach-pills">' + pillsHTML + '</div>' +
        '<div class="stack-expand-hint">Click to explore details</div>' +
        detailsPanel +
      '</div>';
    }).join('');

    grid.addEventListener('click', function (e) {
      var card = e.target.closest('.approach-card');
      if (!card) return;
      var key = card.getAttribute('data-stack');
      if (state.activeStack === key) {
        state.activeStack = null;
        $$('.approach-card').forEach(function (c) { c.classList.remove('active'); });
        $('#matrixGrid').removeAttribute('data-highlight');
      } else {
        state.activeStack = key;
        $$('.approach-card').forEach(function (c) { c.classList.remove('active'); });
        card.classList.add('active');
        var idx = CONFIG.STACKS.findIndex(function (s) { return s.key === key; });
        $('#matrixGrid').setAttribute('data-highlight', idx + 1);
      }
    });
  }

  /* ══════════════════════════════════════════════════════════
     RUNTIME CALLOUT
     ══════════════════════════════════════════════════════════ */
  function renderRuntimeCallout() {
    var container = $('#runtimeCards');
    container.innerHTML = CONFIG.RUNTIMES.map(function (r) {
      var strengthsHTML = r.strengths.map(function (s) {
        return '<span class="runtime-strength">' + s + '</span>';
      }).join('');
      return '<div class="runtime-card runtime-card--' + r.cssClass + '">' +
        '<div class="runtime-card-name runtime-card-name--' + r.cssClass + '">' + r.name + '</div>' +
        '<div class="runtime-card-desc">' + r.description + '</div>' +
        '<div class="runtime-card-strengths">' + strengthsHTML + '</div>' +
      '</div>';
    }).join('');
  }

  /* ══════════════════════════════════════════════════════════
     COMPARISON MATRIX
     ══════════════════════════════════════════════════════════ */
  function renderCellContent(val, stackIdx) {
    var s = CONFIG.STACKS[stackIdx];
    if (val.type === 'check') return '<div class="matrix-check">✓</div>';
    if (val.type === 'cross') return '<div class="matrix-cross">✗</div>';
    if (val.type === 'value') return '<span class="matrix-value">' + val.text + '</span>';
    if (val.type === 'badge') return '<span class="matrix-badge matrix-badge--' + val.style + '">' + val.text + '</span>';
    if (val.type === 'dots') {
      var dots = '';
      for (var i = 0; i < 5; i++) {
        dots += '<span class="matrix-dot' + (i < val.filled ? ' filled' : '') + '" style="' + (i < val.filled ? 'color:' + s.color : '') + '"></span>';
      }
      return '<span class="matrix-dots">' + dots + '</span>';
    }
    return '';
  }

  function renderMatrix() {
    var grid = $('#matrixGrid');
    var html = '';

    html += '<div class="matrix-col-headers">';
    html += '<div class="matrix-col-header">Feature</div>';
    CONFIG.STACKS.forEach(function (s) {
      var layerNames = s.layers.map(function (l) { return l.name; }).join(' + ');
      html += '<div class="matrix-col-header">' +
        '<div class="matrix-col-label">' +
          '<span class="matrix-col-dot" style="background:' + s.color + '"></span>' +
          '<span class="matrix-col-name">' + s.name + '</span>' +
          '<span class="matrix-col-type">' + layerNames + '</span>' +
        '</div></div>';
    });
    html += '</div>';

    CONFIG.MATRIX_CATEGORIES.forEach(function (cat, catIdx) {
      var collapsed = !state.expandedCategories[catIdx];
      html += '<div class="matrix-category' + (collapsed ? ' collapsed' : '') + '" data-cat="' + catIdx + '">';
      html += '<div class="matrix-category-header" data-cat-toggle="' + catIdx + '">' +
        '<span class="matrix-category-title">' + cat.title + '</span>' +
        '<span class="matrix-category-chevron">›</span>' +
      '</div>';

      cat.rows.forEach(function (row) {
        html += '<div class="matrix-row">';
        var tooltip = CONFIG.MATRIX_TOOLTIPS[row.label];
        if (tooltip) {
          html += '<div class="matrix-cell matrix-cell--has-tip" data-tip="' + tooltip.replace(/"/g, '&quot;').replace(/'/g, '&#39;') + '">' +
            '<span>' + row.label + '</span>' +
            '<span class="matrix-info-icon" aria-label="More info">ⓘ</span>' +
          '</div>';
        } else {
          html += '<div class="matrix-cell">' + row.label + '</div>';
        }
        row.values.forEach(function (val, i) {
          html += '<div class="matrix-cell">' + renderCellContent(val, i) + '</div>';
        });
        html += '</div>';
      });

      html += '</div>';
    });

    grid.innerHTML = html;

    grid.addEventListener('click', function (e) {
      var toggle = e.target.closest('[data-cat-toggle]');
      if (!toggle) return;
      var idx = parseInt(toggle.getAttribute('data-cat-toggle'));
      state.expandedCategories[idx] = !state.expandedCategories[idx];
      var cat = toggle.closest('.matrix-category');
      cat.classList.toggle('collapsed');
    });
  }

  /* ══════════════════════════════════════════════════════════
     PERFORMANCE CHART (SVG)
     ══════════════════════════════════════════════════════════ */
  function buildSvgChart() {
    var data = CONFIG.PERF_DATA;
    var container = $('#perfChart');
    var W = 800, H = 450;
    var pad = { top: 30, right: 40, bottom: 60, left: 70 };
    var cW = W - pad.left - pad.right;
    var cH = H - pad.top - pad.bottom;

    var maxY = 4200;
    var contexts = data.contexts;
    var xScale = function (i) { return pad.left + (i / (contexts.length - 1)) * cW; };
    var yScale = function (v) { return pad.top + (1 - v / maxY) * cH; };

    var svg = '<svg viewBox="0 0 ' + W + ' ' + H + '" xmlns="http://www.w3.org/2000/svg">';

    var gridValues = [0, 1000, 2000, 3000, 4000];
    gridValues.forEach(function (v) {
      var y = yScale(v);
      svg += '<line class="perf-gridline" x1="' + pad.left + '" y1="' + y + '" x2="' + (W - pad.right) + '" y2="' + y + '"/>';
      svg += '<text x="' + (pad.left - 10) + '" y="' + (y + 4) + '" text-anchor="end" fill="#718096" font-size="11" font-family="SFMono-Regular,Consolas,monospace">' + v + 'ms</text>';
    });

    contexts.forEach(function (ctx, i) {
      var x = xScale(i);
      svg += '<text x="' + x + '" y="' + (H - 15) + '" text-anchor="middle" fill="#718096" font-size="11" font-family="SFMono-Regular,Consolas,monospace">' + (ctx >= 1000 ? (ctx / 1000) + 'K' : ctx) + '</text>';
    });

    svg += '<text x="' + (W / 2) + '" y="' + (H - 0) + '" text-anchor="middle" fill="#718096" font-size="12" font-family="Red Hat Text,sans-serif">Context Length (tokens)</text>';
    svg += '<text x="15" y="' + (H / 2) + '" text-anchor="middle" fill="#718096" font-size="12" font-family="Red Hat Text,sans-serif" transform="rotate(-90,15,' + (H / 2) + ')">Time to First Token (ms)</text>';

    CONFIG.STACKS.forEach(function (stack) {
      var points = data.stacks[stack.key];
      var d = points.map(function (v, i) {
        return (i === 0 ? 'M' : 'L') + xScale(i).toFixed(1) + ',' + yScale(v).toFixed(1);
      }).join(' ');
      var bold = stack.key === 'cacheaware' ? ' perf-line--bold' : '';
      svg += '<path class="perf-line' + bold + '" d="' + d + '" stroke="' + stack.color + '" data-stack="' + stack.key + '"/>';
    });

    CONFIG.STACKS.forEach(function (stack) {
      var points = data.stacks[stack.key];
      points.forEach(function (v, i) {
        svg += '<circle cx="' + xScale(i).toFixed(1) + '" cy="' + yScale(v).toFixed(1) + '" r="4" fill="' + stack.color + '" stroke="#fff" stroke-width="2" data-tooltip="' + stack.name + ': ' + v + 'ms at ' + contexts[i] + ' tokens" style="cursor:pointer;opacity:0" class="perf-point">';
        svg += '<animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="1.5s" fill="freeze"/>';
        svg += '</circle>';
      });
    });

    svg += '</svg>';
    container.innerHTML = svg;

    setTimeout(function () {
      $$('.perf-line', container).forEach(function (line) {
        line.classList.add('animated');
      });
      $('#perfAnnotation').classList.add('visible');
    }, 300);

    var tooltip = $('#perfTooltip');
    container.addEventListener('mouseover', function (e) {
      if (e.target.classList.contains('perf-point')) {
        tooltip.textContent = e.target.getAttribute('data-tooltip');
        tooltip.classList.add('visible');
      }
    });
    container.addEventListener('mousemove', function (e) {
      var rect = container.getBoundingClientRect();
      var svgEl = container.querySelector('svg');
      if (!svgEl) return;
      var svgRect = svgEl.getBoundingClientRect();
      var scaleX = W / svgRect.width;
      var mouseX = (e.clientX - svgRect.left) * scaleX;

      if (mouseX >= pad.left && mouseX <= W - pad.right) {
        var fraction = (mouseX - pad.left) / cW;
        var nearestIdx = Math.round(fraction * (contexts.length - 1));
        nearestIdx = Math.max(0, Math.min(contexts.length - 1, nearestIdx));

        var crosshair = container.querySelector('.perf-crosshair');
        if (!crosshair) {
          crosshair = document.createElement('div');
          crosshair.className = 'perf-crosshair';
          container.appendChild(crosshair);
        }
        var snapX = xScale(nearestIdx);
        var pxX = snapX / W * svgRect.width;
        crosshair.style.left = pxX + 'px';
        crosshair.style.height = (svgRect.height - (pad.top + pad.bottom) / H * svgRect.height) + 'px';
        crosshair.style.top = (pad.top / H * svgRect.height) + 'px';
        crosshair.classList.add('visible');

        var crosshairTooltip = container.querySelector('.perf-crosshair-tooltip');
        if (!crosshairTooltip) {
          crosshairTooltip = document.createElement('div');
          crosshairTooltip.className = 'perf-crosshair-tooltip';
          container.appendChild(crosshairTooltip);
        }
        var tooltipHTML = '<div class="pctt-context">' + (contexts[nearestIdx] >= 1000 ? (contexts[nearestIdx] / 1000) + 'K' : contexts[nearestIdx]) + ' tokens</div>';
        CONFIG.STACKS.forEach(function (stack) {
          var val = data.stacks[stack.key][nearestIdx];
          tooltipHTML += '<div class="pctt-row"><span class="pctt-dot" style="background:' + stack.color + '"></span><span class="pctt-name">' + stack.name + '</span><span class="pctt-val">' + val + 'ms</span></div>';
        });
        if (nearestIdx > 0) {
          var basicVal = data.stacks.basic[nearestIdx];
          var cacheVal = data.stacks.cacheaware[nearestIdx];
          var speedup = (basicVal / cacheVal).toFixed(1);
          tooltipHTML += '<div class="pctt-speedup">' + speedup + 'x faster with Cache-Aware</div>';
        }
        crosshairTooltip.innerHTML = tooltipHTML;
        var tooltipLeft = pxX + 16;
        if (tooltipLeft + 200 > svgRect.width) tooltipLeft = pxX - 216;
        crosshairTooltip.style.left = tooltipLeft + 'px';
        crosshairTooltip.style.top = (pad.top / H * svgRect.height) + 'px';
        crosshairTooltip.classList.add('visible');
      }

      if (tooltip.classList.contains('visible')) {
        tooltip.style.left = (e.clientX - rect.left + 15) + 'px';
        tooltip.style.top = (e.clientY - rect.top - 30) + 'px';
      }
    });
    container.addEventListener('mouseleave', function () {
      var crosshair = container.querySelector('.perf-crosshair');
      var crosshairTooltip = container.querySelector('.perf-crosshair-tooltip');
      if (crosshair) crosshair.classList.remove('visible');
      if (crosshairTooltip) crosshairTooltip.classList.remove('visible');
    });
    container.addEventListener('mouseout', function (e) {
      if (e.target.classList.contains('perf-point')) {
        tooltip.classList.remove('visible');
      }
    });
  }

  function renderPerfLegend() {
    var container = $('#perfLegend');
    container.innerHTML = CONFIG.STACKS.map(function (s) {
      return '<div class="perf-legend-item">' +
        '<span class="perf-legend-line" style="background:' + s.color + '"></span>' +
        '<span>' + s.name + '</span>' +
      '</div>';
    }).join('');
  }

  /* ══════════════════════════════════════════════════════════
     SCENARIO EXPLORER
     ══════════════════════════════════════════════════════════ */
  function renderScenarioTabs() {
    var container = $('#scenarioTabs');
    container.innerHTML = CONFIG.SCENARIOS.map(function (s) {
      return '<button class="scenario-tab' + (s.key === state.activeScenario ? ' active' : '') + '" data-scenario="' + s.key + '">' +
        s.icon + ' ' + s.label + '</button>';
    }).join('');

    container.addEventListener('click', function (e) {
      var tab = e.target.closest('.scenario-tab');
      if (!tab) return;
      state.activeScenario = tab.getAttribute('data-scenario');
      $$('.scenario-tab').forEach(function (t) { t.classList.remove('active'); });
      tab.classList.add('active');
      renderScenarioContent();
    });
  }

  function renderScenarioContent() {
    var container = $('#scenarioContent');
    var s = CONFIG.SCENARIOS.find(function (sc) { return sc.key === state.activeScenario; });
    if (!s) return;

    var scenarioMetrics = CONFIG.SCENARIO_METRICS[s.key];

    var cardsHTML = CONFIG.STACKS.map(function (stack) {
      var rating = s.ratings[stack.key];
      var isBest = s.best === stack.key;
      var metrics = scenarioMetrics[stack.key];
      return '<div class="scenario-approach' + (isBest ? ' best' : '') + '">' +
        '<div class="scenario-approach-name" style="color:' + stack.color + '">' + stack.name + '</div>' +
        '<div class="scenario-bar-wrapper">' +
          '<div class="scenario-bar-label">Fit Score</div>' +
          '<div class="scenario-bar">' +
            '<div class="scenario-bar-fill" style="width:' + rating + '%;background:' + stack.color + '"></div>' +
          '</div>' +
        '</div>' +
        '<div class="scenario-rating" style="color:' + stack.color + '">' + rating + '/100</div>' +
        (isBest ? '<div class="scenario-best-badge">Best Fit</div>' : '') +
        '<div class="scenario-metrics">' +
          '<div class="scenario-metric"><div class="scenario-metric-val">' + metrics.ttft + '</div><div class="scenario-metric-lbl">Avg TTFT</div></div>' +
          '<div class="scenario-metric"><div class="scenario-metric-val">' + metrics.cacheHit + '</div><div class="scenario-metric-lbl">Cache Hit</div></div>' +
          '<div class="scenario-metric"><div class="scenario-metric-val">' + metrics.throughput + '</div><div class="scenario-metric-lbl">Throughput</div></div>' +
        '</div>' +
      '</div>';
    }).join('');

    container.innerHTML = '<div class="scenario-header">' +
      '<span class="scenario-icon">' + s.icon + '</span>' +
      '<div><h3>' + s.title + '</h3><p>' + s.description + '</p></div>' +
    '</div>' +
    '<div class="scenario-comparison">' + cardsHTML + '</div>' +
    '<div class="scenario-why">' + s.why + '</div>';

    setTimeout(function () {
      $$('.scenario-bar-fill', container).forEach(function (bar) {
        var w = bar.style.width;
        bar.style.width = '0%';
        requestAnimationFrame(function () {
          requestAnimationFrame(function () { bar.style.width = w; });
        });
      });
    }, 50);
  }

  /* ══════════════════════════════════════════════════════════
     DECISION GUIDE
     ══════════════════════════════════════════════════════════ */
  function renderDecisionQuestions() {
    var container = $('#decisionQuestions');
    container.innerHTML = CONFIG.DECISION_QUESTIONS.map(function (q, qi) {
      var toggles = q.options.map(function (o) {
        var active = state.decisionAnswers[qi] === o.key;
        return '<button class="decision-toggle' + (active ? ' active' : '') + '" data-q="' + qi + '" data-key="' + o.key + '">' + o.label + '</button>';
      }).join('');
      return '<div class="decision-question">' +
        '<div class="decision-question-label">' + q.question + '</div>' +
        '<div class="decision-toggles">' + toggles + '</div>' +
      '</div>';
    }).join('');

    container.addEventListener('click', function (e) {
      var btn = e.target.closest('.decision-toggle');
      if (!btn) return;
      var qi = parseInt(btn.getAttribute('data-q'));
      var key = btn.getAttribute('data-key');
      if (state.decisionAnswers[qi] === key) {
        delete state.decisionAnswers[qi];
      } else {
        state.decisionAnswers[qi] = key;
      }
      $$('[data-q="' + qi + '"]', container).forEach(function (b) { b.classList.remove('active'); });
      if (state.decisionAnswers[qi]) btn.classList.add('active');
      renderDecisionResult();
    });
  }

  function scoreStacks() {
    var scores = {};
    CONFIG.STACKS.forEach(function (s) { scores[s.key] = 0; });

    Object.keys(state.decisionAnswers).forEach(function (qi) {
      var answerKey = state.decisionAnswers[qi];
      CONFIG.STACKS.forEach(function (s) {
        var weights = CONFIG.DECISION_WEIGHTS[s.key];
        scores[s.key] += weights[answerKey] || 0;
      });
    });

    var sorted = Object.keys(scores).sort(function (a, b) { return scores[b] - scores[a]; });
    return { scores: scores, sorted: sorted };
  }

  function renderDecisionResult() {
    var container = $('#decisionResult');
    var answered = Object.keys(state.decisionAnswers).length;

    if (answered === 0) {
      container.innerHTML = '<div class="decision-result-title">Your Recommendation</div>' +
        '<p style="color:var(--color-text-muted);font-size:var(--font-size-sm)">Answer the questions on the left to get a personalized recommendation.</p>';
      container.style.borderColor = 'var(--color-border)';
      return;
    }

    var result = scoreStacks();
    var topKey = result.sorted[0];
    var top = getStack(topKey);
    var confidence = answered >= 3 ? 'High' : (answered >= 2 ? 'Medium' : 'Low');
    var confColor = answered >= 3 ? 'var(--color-llmd-bright)' : (answered >= 2 ? '#c05621' : 'var(--color-text-muted)');

    var explanations = {
      cacheaware: 'The Cache-Aware stack (vLLM/SGLang + KServe + llm-d EPP) routes requests to pods with warm KV caches. For workloads with high prefix overlap — chat, agentic, RAG — this eliminates redundant GPU compute and can reduce TTFT by up to 47.5x.',
      platform: 'The Platform stack (vLLM/SGLang + KServe) gives you Kubernetes-native model serving with autoscaling, Gateway API, and canary deploys. Great operational foundation, but routing is still load-balanced — no cache awareness.',
      basic: 'The Basic stack (vLLM/SGLang + round-robin LB) is the simplest deployment. Best for batch workloads with unique prompts where cache-aware routing adds no value, or for non-Kubernetes environments.'
    };

    var alsoHtml = result.sorted.slice(1).map(function (key) {
      var s = getStack(key);
      return '<div class="decision-also-item">' +
        '<span class="decision-also-dot" style="background:' + s.color + '"></span>' +
        '<span>' + s.name + ' (score: ' + result.scores[key] + ')</span>' +
      '</div>';
    }).join('');

    container.style.borderColor = top.color;
    container.innerHTML = '<div class="decision-result-title">Your Recommendation</div>' +
      '<div class="decision-result-approach">' +
        '<span class="decision-result-dot" style="background:' + top.color + '"></span>' +
        '<span class="decision-result-name">' + top.name + '</span>' +
      '</div>' +
      '<div class="decision-result-confidence" style="background:' + confColor + '22;color:' + confColor + ';border:1px solid ' + confColor + '33">' + confidence + ' confidence</div>' +
      '<div class="decision-result-explanation">' + explanations[topKey] + '</div>' +
      '<div class="decision-result-also">' +
        '<div class="decision-result-also-title">Also Consider</div>' +
        alsoHtml +
      '</div>';
  }

  /* ══════════════════════════════════════════════════════════
     MATRIX TOOLTIP
     ══════════════════════════════════════════════════════════ */
  function initMatrixTooltips() {
    var matrixGrid = $('#matrixGrid');
    var tipEl = document.createElement('div');
    tipEl.className = 'matrix-tooltip';
    document.body.appendChild(tipEl);

    matrixGrid.addEventListener('mouseover', function (e) {
      var cell = e.target.closest('.matrix-cell--has-tip');
      if (!cell) return;
      tipEl.textContent = cell.getAttribute('data-tip');
      tipEl.classList.add('visible');
    });
    matrixGrid.addEventListener('mousemove', function (e) {
      if (!tipEl.classList.contains('visible')) return;
      tipEl.style.left = (e.pageX + 12) + 'px';
      tipEl.style.top = (e.pageY - 8) + 'px';
      var rightEdge = tipEl.getBoundingClientRect().right;
      if (rightEdge > window.innerWidth - 16) {
        tipEl.style.left = (e.pageX - tipEl.offsetWidth - 12) + 'px';
      }
    });
    matrixGrid.addEventListener('mouseout', function (e) {
      var cell = e.target.closest('.matrix-cell--has-tip');
      if (cell) tipEl.classList.remove('visible');
    });
  }

  /* ══════════════════════════════════════════════════════════
     ARCHITECTURE ANIMATION
     ══════════════════════════════════════════════════════════ */
  function initArchAnimation() {
    var columns = $$('.arch-column');
    columns.forEach(function (col) {
      var connectors = $$('.arch-connector', col);
      var stack = col.querySelector('.arch-stack');
      if (!stack) return;

      col.addEventListener('mouseenter', function () {
        connectors.forEach(function (conn, i) {
          var dot = document.createElement('div');
          dot.className = 'arch-flow-dot';
          dot.style.animationDelay = (i * 0.3) + 's';
          conn.appendChild(dot);
        });
        col.classList.add('arch-animating');
      });

      col.addEventListener('mouseleave', function () {
        $$('.arch-flow-dot', col).forEach(function (d) { d.remove(); });
        col.classList.remove('arch-animating');
      });
    });
  }

  /* ══════════════════════════════════════════════════════════
     INIT
     ══════════════════════════════════════════════════════════ */
  function init() {
    renderStackCards();
    renderRuntimeCallout();
    renderMatrix();
    initMatrixTooltips();
    buildSvgChart();
    renderPerfLegend();
    renderScenarioTabs();
    renderScenarioContent();
    renderDecisionQuestions();
    renderDecisionResult();
    initScrollProgress();
    initScrollReveal();
    initArchAnimation();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
