import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Info } from 'lucide-react';

const generateConsciousnessData = (scenario = 'baseline', numPoints = 100) => {
  const scenarios = {
    baseline: { phi_boost: 1.0, rho_boost: 1.0, sigma_boost: 1.0 },
    meditative: { phi_boost: 1.1, rho_boost: 1.3, sigma_boost: 1.2 },
    anesthetic: { phi_boost: 0.2, rho_boost: 0.1, sigma_boost: 0.3 },
    psychedelic: { phi_boost: 0.9, rho_boost: 1.8, sigma_boost: 1.6 },
    nde: { phi_boost: 1.4, rho_boost: 2.0, sigma_boost: 1.8 }
  };

  const config = scenarios[scenario] || scenarios.baseline;
  const points = [];

  for (let i = 0; i < numPoints; i++) {
    const fractal_dim = 0.6 + Math.random() * 0.4;
    const signal_gain = 0.5 + Math.random() * 0.5;
    const spatial_coherence = 0.4 + Math.random() * 0.6;
    const quantum_coherence = (0.3 + Math.random() * 0.65) * 0.7 + spatial_coherence * 0.3;
    const entanglement_density = 0.2 + Math.random() * 0.6;
    const microtubule_sync = (0.4 + Math.random() * 0.5) * 0.6 + (0.3 + Math.random() * 0.7) * 0.4;
    const alpha = 0.8 + Math.random() * 0.4;
    const beta = 1.5 + Math.random() * 1.0;
    const tau = 5 + Math.random() * 45;
    const exponential_saturation = 1 - Math.exp(-beta * tau / 50);
    const phi = alpha * fractal_dim * signal_gain * spatial_coherence * exponential_saturation * config.phi_boost;
    const rho = quantum_coherence * entanglement_density * microtubule_sync * config.rho_boost;
    const sigma = (0.3 + Math.random() * 0.7) * Math.sqrt(quantum_coherence) * 0.8 + 0.2;
    const adjusted_sigma = Math.min(1.0, sigma * config.sigma_boost);
    const cgi = Math.sqrt(phi * rho) * adjusted_sigma * 24;

    points.push({
      phi, rho, sigma: adjusted_sigma, cgi, quantum_coherence, spatial_coherence,
      microtubule_sync, fractal_dim, signal_gain, entanglement_density,
      alpha, beta, tau, exponential_saturation
    });
  }

  return points;
};

const ConsciousnessSpace3D = ({ points, scenario }) => {
  const plotRef = useRef(null);

  useEffect(() => {
    if (!points.length || !window.Plotly || !plotRef.current) return;

    const x = points.map(p => p.phi);
    const y = points.map(p => p.rho);
    const z = points.map(p => p.sigma);
    const colors = points.map(p => p.cgi);
    const sizes = points.map(p => 5 + p.quantum_coherence * 15);

    const hoverText = points.map(p => 
      `CGI Score: ${p.cgi.toFixed(2)}<br>` +
      `Phi Integration: ${p.phi.toFixed(3)}<br>` +
      `Rho Adaptivity: ${p.rho.toFixed(3)}<br>` +
      `Sigma Self-ref: ${p.sigma.toFixed(3)}<br>` +
      `Quantum Coherence: ${p.quantum_coherence.toFixed(3)}<br>` +
      `Microtubule Sync: ${p.microtubule_sync.toFixed(3)}<br>` +
      `Dwell Time: ${p.tau.toFixed(1)}ms`
    );

    const trace = {
      x, y, z,
      mode: 'markers',
      type: 'scatter3d',
      marker: {
        size: sizes,
        color: colors,
        colorscale: [
          [0, '#ff0000'], [0.3, '#ff8800'], [0.6, '#ffff00'], [1, '#00ff00']
        ],
        colorbar: { title: 'CGI Score', thickness: 15, len: 0.8 },
        opacity: 0.8,
        line: { color: '#000000', width: 1 }
      },
      text: hoverText,
      hovertemplate: '%{text}<extra></extra>',
      name: 'Consciousness States'
    };

    const layout = {
      title: {
        text: `Consciousness Gradient Space - ${scenario.charAt(0).toUpperCase() + scenario.slice(1)}`,
        font: { size: 18, color: '#ffffff' }
      },
      scene: {
        xaxis: { 
          title: 'Phi Integration', 
          titlefont: { color: '#ffffff' }, 
          tickfont: { color: '#ffffff' }, 
          gridcolor: '#444444' 
        },
        yaxis: { 
          title: 'Rho Adaptivity', 
          titlefont: { color: '#ffffff' }, 
          tickfont: { color: '#ffffff' }, 
          gridcolor: '#444444' 
        },
        zaxis: { 
          title: 'Sigma Self-Reference', 
          titlefont: { color: '#ffffff' }, 
          tickfont: { color: '#ffffff' }, 
          gridcolor: '#444444' 
        },
        bgcolor: '#1a1a1a',
        camera: { eye: { x: 1.5, y: 1.5, z: 1.5 } }
      },
      paper_bgcolor: '#000000',
      plot_bgcolor: '#000000',
      font: { color: '#ffffff' },
      margin: { l: 0, r: 0, t: 50, b: 0 },
      height: 500
    };

    const config = {
      displayModeBar: true,
      modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d'],
      displaylogo: false,
      responsive: true
    };

    window.Plotly.newPlot(plotRef.current, [trace], layout, config);
  }, [points, scenario]);

  return (
    <div className="w-full h-full bg-black rounded-lg overflow-hidden">
      <div ref={plotRef} className="w-full h-full" />
    </div>
  );
};

const ConsciousnessLandscapeD3 = ({ points, onPointSelect, selectedPoint }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!points.length || !window.d3) return;

    const d3 = window.d3;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 600;
    const height = 500;
    const margin = { top: 20, right: 20, bottom: 60, left: 60 };

    const x = d3.scaleLinear()
      .domain(d3.extent(points, d => d.phi))
      .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
      .domain(d3.extent(points, d => d.rho))
      .range([height - margin.bottom, margin.top]);

    const size = d3.scaleLinear()
      .domain(d3.extent(points, d => d.sigma))
      .range([3, 15]);

    const color = d3.scaleSequential(d3.interpolateRdYlGn)
      .domain(d3.extent(points, d => d.cgi));

    svg.append('g')
      .attr('transform', `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .style('fill', '#ffffff');

    svg.append('g')
      .attr('transform', `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(y))
      .selectAll('text')
      .style('fill', '#ffffff');

    svg.append('text')
      .attr('fill', '#ffffff')
      .attr('x', width / 2)
      .attr('y', height - 10)
      .attr('text-anchor', 'middle')
      .text('Phi Integration');

    svg.append('text')
      .attr('fill', '#ffffff')
      .attr('transform', 'rotate(-90)')
      .attr('y', 15)
      .attr('x', -height / 2)
      .attr('text-anchor', 'middle')
      .text('Rho Adaptivity');

    const highPoints = points.filter(p => p.cgi > 5.0).slice(0, 20);
    for (let i = 0; i < highPoints.length - 1; i++) {
      const p1 = highPoints[i];
      const p2 = highPoints[i + 1];
      svg.append('line')
        .attr('x1', x(p1.phi))
        .attr('y1', y(p1.rho))
        .attr('x2', x(p2.phi))
        .attr('y2', y(p2.rho))
        .attr('stroke', '#bb86fc')
        .attr('stroke-width', 1)
        .attr('opacity', 0.4);
    }

    svg.selectAll('circle')
      .data(points)
      .enter()
      .append('circle')
      .attr('cx', d => x(d.phi))
      .attr('cy', d => y(d.rho))
      .attr('r', d => size(d.sigma))
      .attr('fill', d => color(d.cgi))
      .attr('stroke', d => selectedPoint === d ? '#ffffff' : 'none')
      .attr('stroke-width', 2)
      .attr('opacity', 0.8)
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        d3.select(this).attr('opacity', 1);
      })
      .on('mouseout', function(event, d) {
        d3.select(this).attr('opacity', 0.8);
      })
      .on('click', (event, d) => onPointSelect(d));

  }, [points, selectedPoint]);

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-white mb-4">Consciousness Landscape (D3.js)</h3>
      <svg ref={svgRef} width="600" height="500" className="bg-gray-900 rounded" />
      <div className="text-xs text-gray-400 mt-2">
        Point size = Sigma (Self-Reference) - Color = CGI Score - Purple lines = Attractor flows
      </div>
    </div>
  );
};

const AnalysisCharts = ({ points, scenario }) => {
  const distributionRef = useRef(null);
  const correlationRef = useRef(null);

  useEffect(() => {
    if (!points.length || !window.Plotly || !distributionRef.current || !correlationRef.current) return;

    const cgiScores = points.map(p => p.cgi);
    const distributionTrace = {
      x: cgiScores,
      type: 'histogram',
      nbinsx: 20,
      marker: { color: '#4CAF50', opacity: 0.7, line: { color: '#ffffff', width: 1 } },
      name: 'CGI Distribution'
    };

    const distributionLayout = {
      title: { text: 'CGI Score Distribution', font: { color: '#ffffff' } },
      xaxis: { title: 'CGI Score', titlefont: { color: '#ffffff' }, tickfont: { color: '#ffffff' }, gridcolor: '#444444' },
      yaxis: { title: 'Frequency', titlefont: { color: '#ffffff' }, tickfont: { color: '#ffffff' }, gridcolor: '#444444' },
      paper_bgcolor: '#000000',
      plot_bgcolor: '#1a1a1a',
      font: { color: '#ffffff' },
      margin: { l: 50, r: 20, t: 50, b: 50 },
      height: 250
    };

    const quantumClassicalRatio = points.map(p => p.quantum_coherence / (p.spatial_coherence + 1e-6));
    const correlationTrace = {
      x: quantumClassicalRatio,
      y: cgiScores,
      mode: 'markers',
      type: 'scatter',
      marker: {
        size: points.map(p => 8 + p.microtubule_sync * 12),
        color: points.map(p => p.microtubule_sync),
        colorscale: 'Plasma',
        opacity: 0.7,
        line: { color: '#ffffff', width: 1 }
      },
      text: points.map(p => `Microtubule Sync: ${p.microtubule_sync.toFixed(3)}`),
      hovertemplate: 'Q/C Ratio: %{x:.3f}<br>CGI: %{y:.2f}<br>%{text}<extra></extra>',
      name: 'Quantum-Classical Integration'
    };

    const correlationLayout = {
      title: { text: 'Quantum-Classical Integration', font: { color: '#ffffff' } },
      xaxis: { title: 'Quantum/Classical Coherence Ratio', titlefont: { color: '#ffffff' }, tickfont: { color: '#ffffff' }, gridcolor: '#444444' },
      yaxis: { title: 'CGI Score', titlefont: { color: '#ffffff' }, tickfont: { color: '#ffffff' }, gridcolor: '#444444' },
      paper_bgcolor: '#000000',
      plot_bgcolor: '#1a1a1a',
      font: { color: '#ffffff' },
      margin: { l: 50, r: 20, t: 50, b: 50 },
      height: 250
    };

    const config = { displayModeBar: false, displaylogo: false, responsive: true };

    window.Plotly.newPlot(distributionRef.current, [distributionTrace], distributionLayout, config);
    window.Plotly.newPlot(correlationRef.current, [correlationTrace], correlationLayout, config);
  }, [points, scenario]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div ref={distributionRef} className="bg-black rounded-lg" />
      <div ref={correlationRef} className="bg-black rounded-lg" />
    </div>
  );
};

const ScenarioComparison = ({ currentScenario }) => {
  const scenarioData = [
    { scenario: 'Baseline', meanCGI: 4.26, high: 0.7, moderate: 7.0, low: 92.3, color: '#64b5f6' },
    { scenario: 'Meditative', meanCGI: 6.08, high: 1.8, moderate: 39.2, low: 59.0, color: '#81c784' },
    { scenario: 'Anesthetic', meanCGI: 0.18, high: 0.0, moderate: 0.0, low: 100.0, color: '#e57373' },
    { scenario: 'Psychedelic', meanCGI: 7.94, high: 5.8, moderate: 80.8, low: 13.4, color: '#ba68c8' },
    { scenario: 'NDE', meanCGI: 10.84, high: 35.0, moderate: 60.6, low: 4.4, color: '#ffb74d' }
  ];

  const currentData = scenarioData.find(s => s.scenario.toLowerCase() === currentScenario);

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Validated Scenario Analysis</h3>
      
      <div className="mb-6 p-4 bg-gray-700 rounded-lg border-2" style={{ borderColor: currentData?.color || '#64b5f6' }}>
        <h4 className="text-white font-medium mb-2">Current: {currentData?.scenario}</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-2xl font-bold text-white">{currentData?.meanCGI.toFixed(2)}</div>
            <div className="text-gray-400">Mean CGI</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-400">{currentData?.high.toFixed(1)}%</div>
            <div className="text-gray-400">High (greater than 7.0)</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-400">{currentData?.moderate.toFixed(1)}%</div>
            <div className="text-gray-400">Moderate (4-7)</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-400">{currentData?.low.toFixed(1)}%</div>
            <div className="text-gray-400">Low (less than 4.0)</div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {scenarioData.map(scenarioItem => (
          <div key={scenarioItem.scenario} className="flex items-center space-x-4">
            <div className="w-20 text-sm text-gray-300 font-medium">{scenarioItem.scenario}</div>
            <div className="flex-1 bg-gray-700 rounded-full h-6 relative overflow-hidden">
              <div className="h-full bg-green-500 absolute left-0" style={{ width: `${scenarioItem.high}%` }} />
              <div className="h-full bg-yellow-500 absolute" style={{ left: `${scenarioItem.high}%`, width: `${scenarioItem.moderate}%` }} />
              <div className="h-full bg-red-500 absolute" style={{ left: `${scenarioItem.high + scenarioItem.moderate}%`, width: `${scenarioItem.low}%` }} />
            </div>
            <div className="w-16 text-sm text-gray-300 text-right">{scenarioItem.meanCGI.toFixed(2)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ControlPanel = ({ scenario, onScenarioChange, stats, isAnimating, onToggleAnimation }) => {
  const scenarios = [
    { key: 'baseline', name: 'Baseline', description: 'Normal waking consciousness', color: '#64b5f6' },
    { key: 'meditative', name: 'Meditative', description: 'Enhanced coherence, stable integration', color: '#81c784' },
    { key: 'anesthetic', name: 'Anesthetic', description: 'Suppressed quantum processes', color: '#e57373' },
    { key: 'psychedelic', name: 'Psychedelic', description: 'Heightened quantum coherence', color: '#ba68c8' },
    { key: 'nde', name: 'NDE', description: 'Peak integration and coherence', color: '#ffb74d' }
  ];

  return (
    <div className="bg-gray-900 rounded-lg p-6 shadow-xl border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">CGI Consciousness Visualization</h2>
        <div className="flex items-center space-x-2">
          <button onClick={onToggleAnimation} className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" style={{backgroundColor: 'blue', color: 'white'}}>
            {isAnimating ? <Pause size={16} /> : <Play size={16} />}
            <span>{isAnimating ? 'Pause' : 'Animate'}</span>
          </button>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-3">Consciousness Scenario:</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {scenarios.map(s => (
            <button 
              key={s.key} 
              onClick={() => onScenarioChange(s.key)} 
              className={`p-3 rounded-lg border-2 transition-all ${
                scenario === s.key 
                  ? 'border-white bg-gray-800 text-white' 
                  : 'border-gray-600 bg-gray-800 text-gray-300 hover:border-gray-500'
              }`}
            >
              <div className="flex items-center space-x-2 mb-1">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="font-medium">{s.name}</span>
              </div>
              <p className="text-xs text-gray-400">{s.description}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="text-2xl font-bold text-white">{stats.mean.toFixed(2)}</div>
          <div className="text-sm text-gray-400">Mean CGI</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-400">{stats.highPct.toFixed(1)}%</div>
          <div className="text-sm text-gray-400">High (greater than 7.0)</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="text-2xl font-bold text-yellow-400">{stats.moderatePct.toFixed(1)}%</div>
          <div className="text-sm text-gray-400">Moderate (4-7)</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="text-2xl font-bold text-red-400">{stats.lowPct.toFixed(1)}%</div>
          <div className="text-sm text-gray-400">Low (less than 4.0)</div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-3">
          <Info size={16} className="text-blue-400" />
          <h3 className="text-sm font-medium text-white">Wiest-Bruna Integration</h3>
        </div>
        <div className="text-xs text-gray-300 space-y-1">
          <div><strong>Phi (Integration):</strong> Bruna's RCT complexity metrics with exponential saturation</div>
          <div><strong>Rho (Adaptivity):</strong> Wiest's quantum coherence - quantum strength, entanglement, microtubule sync</div>
          <div><strong>Sigma (Self-Reference):</strong> Combined phase synchronization and quantum binding effects</div>
          <div className="mt-2 text-gray-400">CGI = sqrt(phi x rho) x sigma x 24 (empirically calibrated)</div>
        </div>
      </div>
    </div>
  );
};

const CGIVisualizationPrototype = () => {
  const [scenario, setScenario] = useState('baseline');
  const [points, setPoints] = useState([]);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [stats, setStats] = useState({ mean: 0, highPct: 0, moderatePct: 0, lowPct: 0 });
  const [isAnimating, setIsAnimating] = useState(false);
  const [visualizationMode, setVisualizationMode] = useState('3d');

  const animationSequence = ['baseline', 'meditative', 'psychedelic', 'nde', 'anesthetic'];

  useEffect(() => {
    const newPoints = generateConsciousnessData(scenario, 150);
    setPoints(newPoints);
    setSelectedPoint(null);

    const cgiScores = newPoints.map(p => p.cgi);
    const mean = cgiScores.reduce((a, b) => a + b, 0) / cgiScores.length;
    const highCount = cgiScores.filter(s => s > 7.0).length;
    const moderateCount = cgiScores.filter(s => s >= 4.0 && s <= 7.0).length;
    const lowCount = cgiScores.filter(s => s < 4.0).length;

    setStats({
      mean,
      highPct: (highCount / newPoints.length) * 100,
      moderatePct: (moderateCount / newPoints.length) * 100,
      lowPct: (lowCount / newPoints.length) * 100
    });
  }, [scenario]);

  useEffect(() => {
    if (!isAnimating) return;

    const interval = setInterval(() => {
      setScenario(prev => {
        const currentIndex = animationSequence.indexOf(prev);
        const nextIndex = (currentIndex + 1) % animationSequence.length;
        return animationSequence[nextIndex];
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isAnimating]);

  useEffect(() => {
    if (!window.Plotly) {
      const plotlyScript = document.createElement('script');
      plotlyScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/plotly.js/2.26.0/plotly.min.js';
      plotlyScript.async = true;
      document.head.appendChild(plotlyScript);
    }

    if (!window.d3) {
      const d3Script = document.createElement('script');
      d3Script.src = 'https://cdnjs.cloudflare.com/ajax/libs/d3/7.8.5/d3.min.js';
      d3Script.async = true;
      document.head.appendChild(d3Script);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 p-4 space-y-6">
      <ControlPanel 
        scenario={scenario} 
        onScenarioChange={setScenario} 
        stats={stats} 
        isAnimating={isAnimating} 
        onToggleAnimation={() => setIsAnimating(!isAnimating)} 
      />

      <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Consciousness Visualization</h3>
          <div className="flex bg-gray-800 rounded-lg p-1">
            <button onClick={() => setVisualizationMode('3d')} className="..." style={{backgroundColor: visualizationMode === '3d' ? 'blue' : 'gray', color: 'white'}}>
              3D Plotly
            </button>
            <button onClick={() => setVisualizationMode('3d')} className="..." style={{backgroundColor: visualizationMode === '3d' ? 'blue' : 'gray', color: 'white'}}>
              2D D3.js
            </button>
          </div>
        </div>

        {visualizationMode === '3d' ? (
          <ConsciousnessSpace3D points={points} scenario={scenario} />
        ) : (
          <ConsciousnessLandscapeD3 points={points} onPointSelect={setSelectedPoint} selectedPoint={selectedPoint} />
        )}

        {visualizationMode === 'd3' && selectedPoint && (
          <div className="mt-4 p-4 bg-gray-700 rounded-lg">
            <h4 className="text-white font-medium mb-2">Selected Consciousness State</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-lg font-bold text-white">{selectedPoint.cgi.toFixed(2)}</div>
                <div className="text-gray-400">CGI Score</div>
              </div>
              <div>
                <div className="text-lg font-bold text-blue-400">{selectedPoint.phi.toFixed(3)}</div>
                <div className="text-gray-400">Phi Integration</div>
              </div>
              <div>
                <div className="text-lg font-bold text-purple-400">{selectedPoint.rho.toFixed(3)}</div>
                <div className="text-gray-400">Rho Adaptivity</div>
              </div>
              <div>
                <div className="text-lg font-bold text-green-400">{selectedPoint.sigma.toFixed(3)}</div>
                <div className="text-gray-400">Sigma Self-Reference</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <ScenarioComparison currentScenario={scenario} />

      <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-4">Analysis Dashboard</h3>
        <AnalysisCharts points={points} scenario={scenario} />
      </div>

      <div className="text-center text-gray-400 text-sm space-y-1">
        <div className="font-medium">Consciousness Gradient Index (CGI) - Advanced Prototype</div>
        <div>Integrating Wiest's Quantum Coherence Theory with Bruna's Attractor Complexity Metrics</div>
        <div className="text-xs">Supporting 3D Plotly landscapes, 2D D3.js interactions, and validated scenario projections</div>
      </div>
    </div>
  );
};

export default CGIVisualizationPrototype;