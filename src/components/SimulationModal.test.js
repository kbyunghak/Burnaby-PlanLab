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
    expect(screen.getByRole('heading', { name: /baseline and plan comparison/i })).toBeInTheDocument();

    const comparisonSection = screen
      .getByRole('heading', { name: /baseline and plan comparison/i })
      .closest('section');
    const populationRow = within(comparisonSection)
      .getByRole('row', { name: /Population/ });
    expect(populationRow).toHaveTextContent('263,046');
    expect(populationRow).toHaveTextContent('360,000');
    expect(populationRow).toHaveTextContent('378,000');
    expect(populationRow).toHaveTextContent('+18,000');
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
      screen.getAllByText('+18,000', { selector: '.impact-positive' })
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
});
