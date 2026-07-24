import { fireEvent, render, screen, within } from '@testing-library/react';
import { calculateSimulation } from '../simulation/calculateSimulation';
import SimulationModal from './SimulationModal';

jest.mock('recharts', () => ({
  CartesianGrid: () => null,
  Legend: () => null,
  Line: () => null,
  LineChart: ({ children }) => <div>{children}</div>,
  ResponsiveContainer: ({ children }) => <div>{children}</div>,
  Tooltip: () => null,
  XAxis: () => null,
  YAxis: () => null,
}));

const schoolPlan = [{
  buildingName: 'School',
  position: [49.25, -122.98],
}];

describe('SimulationModal', () => {
  test('shows baseline, no-plan, user-plan, and net impact values', () => {
    render(
      <SimulationModal
        isOpen
        onRequestClose={jest.fn()}
        simulationData={calculateSimulation(schoolPlan)}
        facilitiesInstalled={['School']}
      />
    );

    expect(screen.getByRole('heading', { name: /net impact by 2050/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /reference and plan comparison/i })).toBeInTheDocument();

    const comparisonSection = screen
      .getByRole('heading', { name: /reference and plan comparison/i })
      .closest('section');
    const populationRow = within(comparisonSection)
      .getByRole('row', { name: /Population/ });
    expect(populationRow).toHaveTextContent('289,421');
    expect(populationRow).toHaveTextContent('408,150');
    expect(populationRow).toHaveTextContent('428,558');
    expect(populationRow).toHaveTextContent('+20,408');
    expect(populationRow).toHaveTextContent('OCP-based');
  });

  test('describes favorable and unfavorable net impacts semantically', () => {
    render(
      <SimulationModal
        isOpen
        onRequestClose={jest.fn()}
        simulationData={calculateSimulation(schoolPlan)}
        facilitiesInstalled={['School']}
      />
    );

    expect(
      screen.getAllByText('+20,408', { selector: '.impact-positive' })
    ).not.toHaveLength(0);
    expect(
      screen.getAllByText('-425', { selector: '.impact-positive' })
    ).not.toHaveLength(0);
  });

  test('closes from both close controls', () => {
    const onRequestClose = jest.fn();

    render(
      <SimulationModal
        isOpen
        onRequestClose={onRequestClose}
        simulationData={calculateSimulation(schoolPlan)}
        facilitiesInstalled={['School']}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /close simulation results/i }));
    fireEvent.click(screen.getByRole('button', { name: /close results/i }));
    expect(onRequestClose).toHaveBeenCalledTimes(2);
  });

  test('identifies the immutable plan snapshot used for the result', () => {
    const simulationData = {
      ...calculateSimulation(schoolPlan),
      planSnapshot: {
        facilityCount: 1,
        totalCost: 500,
        remainingBudget: 9500,
      },
    };

    render(
      <SimulationModal
        isOpen
        onRequestClose={jest.fn()}
        simulationData={simulationData}
        facilitiesInstalled={['School']}
      />
    );

    const snapshot = screen.getByRole('complementary', {
      name: 'Simulated plan snapshot',
    });
    expect(snapshot).toHaveTextContent('1 proposed facility');
    expect(snapshot).toHaveTextContent('$500 allocated');
    expect(snapshot).toHaveTextContent('$9,500 unallocated');
  });

  test('labels an empty plan as a sourced no-plan reference scenario', () => {
    render(
      <SimulationModal
        isOpen
        onRequestClose={jest.fn()}
        simulationData={{
          ...calculateSimulation([]),
          planSnapshot: {
            facilityCount: 0,
            totalCost: 0,
            remainingBudget: 10000,
          },
        }}
        facilitiesInstalled={[]}
      />
    );

    expect(
      screen.getByRole('heading', { name: 'Burnaby 2050 Reference Outlook' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'No Change From Your Plan' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('complementary', { name: 'Reference scenario source' })
    ).toHaveTextContent('Official reference');
    expect(
      screen.getByRole('link', { name: 'View official source' })
    ).toHaveAttribute('href', expect.stringContaining('Burnaby%202050'));
  });
});
