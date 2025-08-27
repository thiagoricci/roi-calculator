import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, TrendingDown, Calculator, Users, Bot, PhoneOff, DollarSign } from 'lucide-react';

const ROICalculator = () => {
  // Employee vs AI costs
  const [employeeSalary, setEmployeeSalary] = useState<number>(60000);
  const [employeeBenefits, setEmployeeBenefits] = useState<number>(15000);
  
  // Missed deal opportunity
  const [missedCallsPerMonth, setMissedCallsPerMonth] = useState<number>(20);
  const [conversionRate, setConversionRate] = useState<number>(15);
  const [averageDealValue, setAverageDealValue] = useState<number>(5000);
  
  // AI costs (shared between both calculations)
  const [setupCost, setSetupCost] = useState<number>(2500);
  const [monthlyCost, setMonthlyCost] = useState<number>(1200);

  // Employee cost calculations
  const employeeCalculations = useMemo(() => {
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

  // Missed deal opportunity calculations
  const opportunityCalculations = useMemo(() => {
    const monthlyMissedDeals = (missedCallsPerMonth * conversionRate) / 100;
    const monthlyMissedRevenue = monthlyMissedDeals * averageDealValue;
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    
    const monthlyData = months.map(month => {
      const missedRevenueTotal = monthlyMissedRevenue * month;
      const aiCostTotal = setupCost + (monthlyCost * month);
      const netGain = missedRevenueTotal - aiCostTotal;
      const roi = aiCostTotal > 0 ? (netGain / aiCostTotal) * 100 : 0;
      
      return {
        month,
        missedRevenue: monthlyMissedRevenue,
        missedRevenueTotal,
        aiCostTotal,
        netGain,
        roi
      };
    });

    const annualMissedRevenue = monthlyMissedRevenue * 12;
    const annualAiCost = setupCost + (monthlyCost * 12);
    const annualNetGain = annualMissedRevenue - annualAiCost;
    const annualROI = annualAiCost > 0 ? (annualNetGain / annualAiCost) * 100 : 0;

    return {
      monthlyData,
      monthlyMissedDeals,
      monthlyMissedRevenue,
      annualMissedRevenue,
      annualAiCost,
      annualNetGain,
      annualROI
    };
  }, [missedCallsPerMonth, conversionRate, averageDealValue, setupCost, monthlyCost]);

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
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Compare costs and calculate ROI for our AI Voice Agent solution
          </p>
        </div>

        <Tabs defaultValue="cost-comparison" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="cost-comparison" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Cost Comparison
            </TabsTrigger>
            <TabsTrigger value="missed-opportunities" className="flex items-center gap-2">
              <PhoneOff className="h-4 w-4" />
              Missed Opportunities
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cost-comparison" className="space-y-6">
            {/* Employee vs AI Cost Comparison */}
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
                      <span className="text-lg font-bold">{formatCurrency(employeeCalculations.annualEmployeeCost)}</span>
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
                      <span className="text-lg font-bold">{formatCurrency(employeeCalculations.annualAiCost)}</span>
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
                      {formatCurrency(employeeCalculations.annualSavings)}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Savings</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-success">
                      {employeeCalculations.annualSavingsPercentage.toFixed(1)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Cost Reduction</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {employeeCalculations.annualSavingsPercentage > 0 ? Math.floor(12 * (employeeCalculations.annualSavingsPercentage / 100)) : 0}
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
                      {employeeCalculations.monthlyData.map((data) => (
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
                        <td className="text-right py-4 px-4">{formatCurrency(employeeCalculations.annualEmployeeCost)}</td>
                        <td className="text-right py-4 px-4">{formatCurrency(employeeCalculations.annualAiCost)}</td>
                        <td className="text-right py-4 px-4">
                          <span className={employeeCalculations.annualSavings >= 0 ? 'text-success' : 'text-destructive'}>
                            {employeeCalculations.annualSavings >= 0 ? '+' : ''}{formatCurrency(employeeCalculations.annualSavings)}
                          </span>
                        </td>
                        <td className="text-center py-4 px-4">
                          <Badge 
                            variant={employeeCalculations.annualSavingsPercentage >= 0 ? 'default' : 'destructive'}
                            className={employeeCalculations.annualSavingsPercentage >= 0 ? 'bg-success hover:bg-success/80' : ''}
                          >
                            {employeeCalculations.annualSavingsPercentage >= 0 ? (
                              <TrendingUp className="h-3 w-3 mr-1" />
                            ) : (
                              <TrendingDown className="h-3 w-3 mr-1" />
                            )}
                            {Math.abs(employeeCalculations.annualSavingsPercentage).toFixed(1)}%
                          </Badge>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="missed-opportunities" className="space-y-6">
            {/* Missed Opportunities Calculator */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PhoneOff className="h-5 w-5" />
                    Missed Call Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="missed-calls">Missed Calls per Month</Label>
                    <Input
                      id="missed-calls"
                      type="number"
                      value={missedCallsPerMonth}
                      onChange={(e) => setMissedCallsPerMonth(Number(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="conversion-rate">Conversion Rate (%)</Label>
                    <Input
                      id="conversion-rate"
                      type="number"
                      value={conversionRate}
                      onChange={(e) => setConversionRate(Number(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="deal-value">Average Deal Value</Label>
                    <Input
                      id="deal-value"
                      type="number"
                      value={averageDealValue}
                      onChange={(e) => setAverageDealValue(Number(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                  <div className="pt-2 border-t">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Missed Deals/Month:</span>
                        <span className="text-lg font-bold">{opportunityCalculations.monthlyMissedDeals.toFixed(1)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Monthly Lost Revenue:</span>
                        <span className="text-lg font-bold text-destructive">{formatCurrency(opportunityCalculations.monthlyMissedRevenue)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="h-5 w-5" />
                    AI Voice Agent Investment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="setup-cost-opp">One-time Setup Fee</Label>
                    <Input
                      id="setup-cost-opp"
                      type="number"
                      value={setupCost}
                      onChange={(e) => setSetupCost(Number(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="monthly-cost-opp">Monthly Subscription</Label>
                    <Input
                      id="monthly-cost-opp"
                      type="number"
                      value={monthlyCost}
                      onChange={(e) => setMonthlyCost(Number(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Total Annual Cost:</span>
                      <span className="text-lg font-bold">{formatCurrency(opportunityCalculations.annualAiCost)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Revenue Opportunity Summary */}
            <Card className="border-2 border-success/20 bg-success/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-success">
                  <DollarSign className="h-5 w-5" />
                  Revenue Opportunity Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-success">
                      {formatCurrency(opportunityCalculations.annualNetGain)}
                    </div>
                    <div className="text-sm text-muted-foreground">Net Revenue Gain</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-success">
                      {formatCurrency(opportunityCalculations.annualMissedRevenue)}
                    </div>
                    <div className="text-sm text-muted-foreground">Captured Revenue</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {opportunityCalculations.annualROI.toFixed(0)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Annual ROI</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Monthly Opportunity Breakdown Table */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Revenue Opportunity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Month</th>
                        <th className="text-right py-3 px-4">Captured Revenue</th>
                        <th className="text-right py-3 px-4">AI Investment</th>
                        <th className="text-right py-3 px-4">Net Gain</th>
                        <th className="text-center py-3 px-4">ROI</th>
                      </tr>
                    </thead>
                    <tbody>
                      {opportunityCalculations.monthlyData.map((data) => (
                        <tr key={data.month} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4 font-medium">Month {data.month}</td>
                          <td className="text-right py-3 px-4 text-success">{formatCurrency(data.missedRevenueTotal)}</td>
                          <td className="text-right py-3 px-4">{formatCurrency(data.aiCostTotal)}</td>
                          <td className="text-right py-3 px-4">
                            <span className={data.netGain >= 0 ? 'text-success' : 'text-destructive'}>
                              {data.netGain >= 0 ? '+' : ''}{formatCurrency(data.netGain)}
                            </span>
                          </td>
                          <td className="text-center py-3 px-4">
                            <Badge 
                              variant={data.roi >= 0 ? 'default' : 'destructive'}
                              className={data.roi >= 0 ? 'bg-success hover:bg-success/80' : ''}
                            >
                              {data.roi >= 0 ? (
                                <TrendingUp className="h-3 w-3 mr-1" />
                              ) : (
                                <TrendingDown className="h-3 w-3 mr-1" />
                              )}
                              {Math.abs(data.roi).toFixed(0)}%
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-muted/50 font-bold">
                        <td className="py-4 px-4">Annual Total</td>
                        <td className="text-right py-4 px-4 text-success">{formatCurrency(opportunityCalculations.annualMissedRevenue)}</td>
                        <td className="text-right py-4 px-4">{formatCurrency(opportunityCalculations.annualAiCost)}</td>
                        <td className="text-right py-4 px-4">
                          <span className={opportunityCalculations.annualNetGain >= 0 ? 'text-success' : 'text-destructive'}>
                            {opportunityCalculations.annualNetGain >= 0 ? '+' : ''}{formatCurrency(opportunityCalculations.annualNetGain)}
                          </span>
                        </td>
                        <td className="text-center py-4 px-4">
                          <Badge 
                            variant={opportunityCalculations.annualROI >= 0 ? 'default' : 'destructive'}
                            className={opportunityCalculations.annualROI >= 0 ? 'bg-success hover:bg-success/80' : ''}
                          >
                            {opportunityCalculations.annualROI >= 0 ? (
                              <TrendingUp className="h-3 w-3 mr-1" />
                            ) : (
                              <TrendingDown className="h-3 w-3 mr-1" />
                            )}
                            {Math.abs(opportunityCalculations.annualROI).toFixed(0)}%
                          </Badge>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ROICalculator;