import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Calculator, Users, Bot } from 'lucide-react';

const ROICalculator = () => {
  const [employeeSalary, setEmployeeSalary] = useState<number>(60000);
  const [employeeBenefits, setEmployeeBenefits] = useState<number>(15000);
  const [setupCost, setSetupCost] = useState<number>(2500);
  const [monthlyCost, setMonthlyCost] = useState<number>(1200);

  const calculations = useMemo(() => {
    const monthlyEmployeeCost = (employeeSalary + employeeBenefits) / 12;
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    
    const monthlyData = months.map(month => {
      const employeeTotal = monthlyEmployeeCost * month;
      const aiTotal = setupCost + (monthlyCost * month);
      const savings = employeeTotal - aiTotal;
      const savingsPercentage = employeeTotal > 0 ? (savings / employeeTotal) * 100 : 0;
      
      return {
        month,
        employeeTotal,
        aiTotal,
        savings,
        savingsPercentage
      };
    });

    const annualEmployeeCost = employeeSalary + employeeBenefits;
    const annualAiCost = setupCost + (monthlyCost * 12);
    const annualSavings = annualEmployeeCost - annualAiCost;
    const annualSavingsPercentage = annualEmployeeCost > 0 ? (annualSavings / annualEmployeeCost) * 100 : 0;

    return {
      monthlyData,
      annualEmployeeCost,
      annualAiCost,
      annualSavings,
      annualSavingsPercentage
    };
  }, [employeeSalary, employeeBenefits, setupCost, monthlyCost]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Calculator className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">ROI Calculator</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Compare the annual cost of an employee vs our AI Voice Agent solution
          </p>
        </div>

        {/* Input Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Employee Costs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="salary">Annual Salary</Label>
                <Input
                  id="salary"
                  type="number"
                  value={employeeSalary}
                  onChange={(e) => setEmployeeSalary(Number(e.target.value))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="benefits">Annual Benefits & Overhead</Label>
                <Input
                  id="benefits"
                  type="number"
                  value={employeeBenefits}
                  onChange={(e) => setEmployeeBenefits(Number(e.target.value))}
                  className="mt-1"
                />
              </div>
              <div className="pt-2 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Total Annual Cost:</span>
                  <span className="text-lg font-bold">{formatCurrency(calculations.annualEmployeeCost)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                AI Voice Agent Costs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="setup">One-time Setup Fee</Label>
                <Input
                  id="setup"
                  type="number"
                  value={setupCost}
                  onChange={(e) => setSetupCost(Number(e.target.value))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="monthly">Monthly Subscription</Label>
                <Input
                  id="monthly"
                  type="number"
                  value={monthlyCost}
                  onChange={(e) => setMonthlyCost(Number(e.target.value))}
                  className="mt-1"
                />
              </div>
              <div className="pt-2 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Total Annual Cost:</span>
                  <span className="text-lg font-bold">{formatCurrency(calculations.annualAiCost)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Annual Savings Summary */}
        <Card className="border-2 border-success/20 bg-success/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-success">
              <TrendingUp className="h-5 w-5" />
              Annual Savings Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-success">
                  {formatCurrency(calculations.annualSavings)}
                </div>
                <div className="text-sm text-muted-foreground">Total Savings</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-success">
                  {calculations.annualSavingsPercentage.toFixed(1)}%
                </div>
                <div className="text-sm text-muted-foreground">Cost Reduction</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {calculations.annualSavingsPercentage > 0 ? Math.floor(12 * (calculations.annualSavingsPercentage / 100)) : 0}
                </div>
                <div className="text-sm text-muted-foreground">Months ROI</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Breakdown Table */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Cost Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Month</th>
                    <th className="text-right py-3 px-4">Employee Cost</th>
                    <th className="text-right py-3 px-4">AI Agent Cost</th>
                    <th className="text-right py-3 px-4">Savings</th>
                    <th className="text-center py-3 px-4">% Saved</th>
                  </tr>
                </thead>
                <tbody>
                  {calculations.monthlyData.map((data) => (
                    <tr key={data.month} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium">Month {data.month}</td>
                      <td className="text-right py-3 px-4">{formatCurrency(data.employeeTotal)}</td>
                      <td className="text-right py-3 px-4">{formatCurrency(data.aiTotal)}</td>
                      <td className="text-right py-3 px-4">
                        <span className={data.savings >= 0 ? 'text-success' : 'text-destructive'}>
                          {data.savings >= 0 ? '+' : ''}{formatCurrency(data.savings)}
                        </span>
                      </td>
                      <td className="text-center py-3 px-4">
                        <Badge 
                          variant={data.savingsPercentage >= 0 ? 'default' : 'destructive'}
                          className={data.savingsPercentage >= 0 ? 'bg-success hover:bg-success/80' : ''}
                        >
                          {data.savingsPercentage >= 0 ? (
                            <TrendingUp className="h-3 w-3 mr-1" />
                          ) : (
                            <TrendingDown className="h-3 w-3 mr-1" />
                          )}
                          {Math.abs(data.savingsPercentage).toFixed(1)}%
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-muted/50 font-bold">
                    <td className="py-4 px-4">Annual Total</td>
                    <td className="text-right py-4 px-4">{formatCurrency(calculations.annualEmployeeCost)}</td>
                    <td className="text-right py-4 px-4">{formatCurrency(calculations.annualAiCost)}</td>
                    <td className="text-right py-4 px-4">
                      <span className={calculations.annualSavings >= 0 ? 'text-success' : 'text-destructive'}>
                        {calculations.annualSavings >= 0 ? '+' : ''}{formatCurrency(calculations.annualSavings)}
                      </span>
                    </td>
                    <td className="text-center py-4 px-4">
                      <Badge 
                        variant={calculations.annualSavingsPercentage >= 0 ? 'default' : 'destructive'}
                        className={calculations.annualSavingsPercentage >= 0 ? 'bg-success hover:bg-success/80' : ''}
                      >
                        {calculations.annualSavingsPercentage >= 0 ? (
                          <TrendingUp className="h-3 w-3 mr-1" />
                        ) : (
                          <TrendingDown className="h-3 w-3 mr-1" />
                        )}
                        {Math.abs(calculations.annualSavingsPercentage).toFixed(1)}%
                      </Badge>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ROICalculator;